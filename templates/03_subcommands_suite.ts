#!/usr/bin/env bun
/**
 * Template 3: Multi-Command Suite (Subcommand Routing & Actions)
 *
 * Demonstrates:
 * - Registering subcommands (e.g., init, build, deploy, status)
 * - Assigning subcommand descriptions, flags, and async action handlers
 * - Executing `app.run()` to dispatch matching subcommands
 * - Automatic help generator for subcommands
 *
 * Usage:
 *   bun run templates/03_subcommands_suite.ts --help
 *   bun run templates/03_subcommands_suite.ts init --template react
 *   bun run templates/03_subcommands_suite.ts build --minify --target bun
 *   bun run templates/03_subcommands_suite.ts deploy --env production --force
 */

import { SimpleCLI } from '../src/index.ts';

const app = SimpleCLI.newApp('dockctl', '1.0.0')
  .setDescription('Container and Service Management Suite');

// Subcommand 1: init
app.command('init', (cmd) => {
  cmd.setDescription('Initialize a new service container manifest')
    .addFlagString('template', 't', 'node', 'Template archetype (node, bun, rust, python)')
    .action(async (flags, args) => {
      app.println(app.cyan('🚀 Initializing service...'));
      app.println(`Template Archetype: ${app.green(flags.template)}`);
      if (args.length > 0) {
        app.println(`Service Name: ${args[0]}`);
      }
    });
});

// Subcommand 2: build
app.command('build', (cmd) => {
  cmd.setDescription('Build and bundle the service artifact')
    .addFlagString('target', 'T', 'bun', 'Build target runtime (bun, node, browser)')
    .addFlagBool('minify', 'm', false, 'Minify production output bundle')
    .action(async (flags) => {
      app.println(app.cyan('🔨 Building container image...'));
      app.println(`Target: ${flags.target} | Minify: ${flags.minify ? 'YES' : 'NO'}`);
      await app.spinner('Bundling source modules...', 1000);
      app.println(app.green('✔ Build complete: dist/service.bundle.js'));
    });
});

// Subcommand 3: deploy
app.command('deploy', (cmd) => {
  cmd.setDescription('Deploy service container to target cluster')
    .addFlagString('env', 'e', 'staging', 'Target deployment environment (staging, prod)')
    .addFlagBool('force', 'f', false, 'Force restart existing running containers')
    .action(async (flags, args) => {
      app.banner('Deployment Manager', `Environment: ${flags.env.toUpperCase()}`);
      app.println(`Target Service: ${args[0] || 'all-services'}`);
      app.println(`Force Mode: ${flags.force ? app.red('ENABLED') : 'Disabled'}`);
      
      const pipeline = app.newPipeline('Deployment Pipeline');
      pipeline.addStep('Verifying cluster health', async () => true);
      pipeline.addStep('Pushing container image', async () => true);
      pipeline.addStep('Switching traffic routes', async () => true);
      
      const ok = await pipeline.run();
      if (ok) {
        app.println(app.green('\n✔ Service deployed successfully!'));
      }
    });
});

// Execute the command runner
await app.run();
