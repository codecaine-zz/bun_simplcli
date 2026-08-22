#!/usr/bin/env bun
/**
 * Template 1: Minimalist Flag & Argument Parser
 *
 * Demonstrates:
 * - Creating a SimpleCLI application
 * - Defining typed CLI flags (string, int, bool, array)
 * - Handling help messages and version flags
 * - Retrieving flag values and positional arguments
 * - Colored output and status formatting
 *
 * Usage:
 *   bun run templates/01_basic_flags.ts --help
 *   bun run templates/01_basic_flags.ts --env production --port 8080 --verbose file1.txt file2.txt
 */

import { SimpleCLI } from '../src/index.ts';

// 1. Initialize application metadata
const app = SimpleCLI.newApp('file-sync', '1.0.0')
  .setDescription('Synchronize and process files with configurable flags')
  .setAuthor('Developer <dev@example.com>');

// 2. Define CLI flags (Long name, short alias, default value, help description)
app.addFlagString('env', 'e', 'development', 'Target environment (development, staging, production)');
app.addFlagInt('port', 'p', 3000, 'Server port to bind to');
app.addFlagBool('verbose', 'v', false, 'Enable verbose debug output');
app.addFlagBool('dry-run', 'd', false, 'Simulate execution without modifying files');
app.addFlagArray('exclude', 'x', [], 'Patterns or filenames to exclude');

// 3. Parse command-line arguments (returns false if --help or --version was triggered)
if (!app.parseCli()) {
  process.exit(0);
}

// 4. Retrieve parsed flag values and positional arguments
const env = app.getFlagString('env');
const port = app.getFlagInt('port');
const isVerbose = app.getFlagBool('verbose');
const isDryRun = app.getFlagBool('dry-run');
const exclusions = app.getFlagArray('exclude');
const files = app.getPositionalArgs();

// 5. Application logic
app.banner('File Sync Utility', `Running in ${env.toUpperCase()} mode`);

app.println(app.cyan(`🌐 Target Port:`), `${port}`);
app.println(app.cyan(`🔍 Verbose Logging:`), isVerbose ? app.green('ENABLED') : app.dim('DISABLED'));
app.println(app.cyan(`🛡️ Dry Run Mode:`), isDryRun ? app.yellow('YES') : 'NO');

if (exclusions.length > 0) {
  app.println(app.cyan(`🚫 Excluded patterns:`), exclusions.join(', '));
}

if (files.length === 0) {
  app.println(app.yellow('\n⚠ No input files provided. Pass files as positional arguments:'));
  app.println(app.dim('  bun run templates/01_basic_flags.ts src/file1.txt src/file2.txt'));
} else {
  app.println(app.green(`\n✔ Processing ${files.length} file(s):`));
  files.forEach((file, index) => {
    app.println(`  ${app.dim(`${index + 1}.`)} ${file}`);
  });
}
