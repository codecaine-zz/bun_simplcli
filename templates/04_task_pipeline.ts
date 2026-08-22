#!/usr/bin/env bun
/**
 * Template 4: DevOps & Automation Task Pipeline
 *
 * Demonstrates:
 * - Multi-step sequential task execution with progress tracking
 * - Step counters and banners
 * - Progress bar simulation
 * - Animated async spinners
 * - Meter gauges for threshold metrics
 * - Comprehensive pipeline status reporting
 *
 * Usage:
 *   bun run templates/04_task_pipeline.ts
 */

import { SimpleCLI } from '../src/index.ts';

const app = SimpleCLI.newApp('release-pilot', '1.0.0')
  .setDescription('Automated release and verification workflow');

async function main() {
  app.banner('Release Pilot Pipeline', 'Production Release v1.0.0');

  // 1. Interactive Step Indicators
  app.step(1, 'Validating environment & dependencies');
  await app.spinner('Checking Node & Bun runtime compatibility...', 600);
  app.println(app.green('  ✓ Runtime checks passed (Bun v' + Bun.version + ')'));

  app.step(2, 'Running Automated Task Pipeline');
  const pipeline = app.newPipeline('CI/CD Verification Suite');

  pipeline.addStep('Lint codebase & format checks', async () => {
    await Bun.sleep(200);
    return true;
  });

  pipeline.addStep('Execute unit & integration test suite', async () => {
    await Bun.sleep(300);
    return true;
  });

  pipeline.addStep('Build production bundle & source maps', async () => {
    await Bun.sleep(250);
    return true;
  });

  pipeline.addStep('Generate cryptographic SHA-256 checksums', async () => {
    await Bun.sleep(150);
    return true;
  });

  const pipelineSuccess = await pipeline.run();

  if (!pipelineSuccess) {
    app.println(app.red('✖ Pipeline aborted due to step failure.'));
    process.exit(1);
  }

  // 3. Progress Bar Simulation (e.g. Asset upload)
  app.step(3, 'Uploading distribution assets to CDN');
  const totalChunks = 50;
  for (let i = 1; i <= totalChunks; i++) {
    app.progressBar(i, totalChunks, 'CDN Upload');
    await Bun.sleep(20);
  }
  app.println('');

  // 4. Resource Usage Gauge
  app.step(4, 'Post-Deployment Resource Audit');
  app.gauge('Cluster Memory Pressure', 3.8, 8.0, 'GB');
  app.gauge('CPU Load Average', 42.5, 100.0, '%');

  // 5. Final Confirmation Panel
  app.panel(
    'Release Succeeded',
    'Version v1.0.0 is live on all 8 edge nodes.\nTelemetry reports zero errors and latency < 15ms.'
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
