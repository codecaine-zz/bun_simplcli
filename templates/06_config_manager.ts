#!/usr/bin/env bun
/**
 * Template 6: Persistent Config & Settings Store
 *
 * Demonstrates:
 * - Zero-config persistent user settings stored in OS config directory (`~/.config/<app>/config.json`)
 * - Getting, setting, checking, and deleting nested config keys
 * - Managing user session / auth token state
 * - Interactive configuration setter
 *
 * Usage:
 *   bun run templates/06_config_manager.ts
 *   bun run templates/06_config_manager.ts --set api_key=xyz123
 *   bun run templates/06_config_manager.ts --get api_key
 *   bun run templates/06_config_manager.ts --clear
 */

import { SimpleCLI } from '../src/index.ts';

const app = SimpleCLI.newApp('my-settings-cli', '1.0.0')
  .setDescription('Manage persistent configuration, API credentials, and preferences');

app.addFlagString('get', 'g', '', 'Get configuration value by key');
app.addFlagString('set', 's', '', 'Set configuration key=value');
app.addFlagString('delete', 'd', '', 'Delete configuration key');
app.addFlagBool('clear', 'C', false, 'Clear all stored configuration');

if (!app.parseCli()) {
  process.exit(0);
}

const getKey = app.getFlagString('get');
const setPair = app.getFlagString('set');
const deleteKey = app.getFlagString('delete');
const isClear = app.getFlagBool('clear');

app.banner('Configuration Manager', `Store: ~/.config/my-settings-cli/config.json`);

if (isClear) {
  app.config.clear();
  app.println(app.green('✔ All configuration cleared successfully.'));
  process.exit(0);
}

if (setPair) {
  const [key, ...rest] = setPair.split('=');
  const value = rest.join('=');
  if (!key || value === undefined) {
    app.println(app.red('✖ Invalid format. Use: --set key=value'));
    process.exit(1);
  }
  app.config.set(key.trim(), value.trim());
  app.println(app.green(`✔ Saved config "${key.trim()}" = "${value.trim()}"`));
  process.exit(0);
}

if (deleteKey) {
  if (app.config.has(deleteKey)) {
    app.config.delete(deleteKey);
    app.println(app.green(`✔ Deleted config key "${deleteKey}"`));
  } else {
    app.println(app.yellow(`⚠ Key "${deleteKey}" does not exist in config.`));
  }
  process.exit(0);
}

if (getKey) {
  const value = app.config.get(getKey);
  if (value !== undefined) {
    app.println(app.cyan(`Key "${getKey}":`), typeof value === 'object' ? JSON.stringify(value, null, 2) : `${value}`);
  } else {
    app.println(app.yellow(`⚠ Key "${getKey}" not found.`));
  }
  process.exit(0);
}

// Default: Display all current stored configuration
const allConfig = app.config.all();
const keys = Object.keys(allConfig);

if (keys.length === 0) {
  app.println(app.yellow('No stored settings found. Try adding some:'));
  app.println(app.dim('  bun run templates/06_config_manager.ts --set endpoint=https://api.example.com'));
  app.println(app.dim('  bun run templates/06_config_manager.ts --set user.email=dev@example.com'));
} else {
  app.println(app.bold('Current Stored Configuration:\n'));
  app.printKv(allConfig as Record<string, string>);
}
