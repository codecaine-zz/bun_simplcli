#!/usr/bin/env bun
/**
 * Template 7: Data Processing & Formatted Table Reporting
 *
 * Demonstrates:
 * - Processing tabular or numeric datasets
 * - Calculating mathematical & statistical metrics using `stdlib`
 * - Rendering formatted terminal tables
 * - Generating Unicode sparkline distribution charts
 * - Exporting table data to JSON and CSV formats
 *
 * Usage:
 *   bun run templates/07_data_reporter.ts
 *   bun run templates/07_data_reporter.ts --format json
 *   bun run templates/07_data_reporter.ts --format csv
 */

import { SimpleCLI, stdlib } from '../src/index.ts';

const app = SimpleCLI.newApp('api-reporter', '1.0.0')
  .setDescription('Analyze API endpoint latencies and render visual terminal reports');

app.addFlagString('format', 'f', 'table', 'Output format (table, json, csv)');

if (!app.parseCli()) {
  process.exit(0);
}

const format = app.getFlagString('format');

// Sample dataset of API endpoints and response latency times (in milliseconds)
const endpointMetrics = [
  { name: 'GET /api/v1/users', p50: 12, p95: 45, p99: 110, history: [10, 12, 14, 11, 45, 12, 110, 15] },
  { name: 'POST /api/v1/auth/login', p50: 34, p95: 88, p99: 210, history: [30, 34, 38, 88, 35, 210, 32] },
  { name: 'GET /api/v1/products', p50: 8, p95: 22, p99: 48, history: [7, 8, 9, 8, 22, 10, 48, 8] },
  { name: 'PUT /api/v1/orders/checkout', p50: 65, p95: 140, p99: 380, history: [60, 65, 70, 140, 68, 380, 64] },
  { name: 'GET /healthz', p50: 1, p95: 2, p99: 4, history: [1, 1, 2, 1, 2, 1, 4, 1] },
];

const headers = ['Endpoint Route', 'p50 (ms)', 'p95 (ms)', 'p99 (ms)', 'Trend Sparkline'];
const rows = endpointMetrics.map((item) => [
  item.name,
  `${item.p50} ms`,
  `${item.p95} ms`,
  item.p99 > 200 ? app.red(`${item.p99} ms ⚠`) : `${item.p99} ms`,
  app.sparkline(item.history),
]);

if (format === 'json') {
  app.println(JSON.stringify(endpointMetrics, null, 2));
} else if (format === 'csv') {
  app.println(headers.join(','));
  endpointMetrics.forEach((item) => {
    app.println(`"${item.name}",${item.p50},${item.p95},${item.p99}`);
  });
} else {
  // Render visual console report
  app.banner('API Latency & SLA Performance Report', 'Sample Window: Last 60 minutes');

  app.table(headers, rows);

  // Calculate high-level summary statistics
  const allP99s = endpointMetrics.map((m) => m.p99);
  const avgP99 = stdlib.mean(allP99s);
  const medianP99 = stdlib.median(allP99s);
  const maxP99 = Math.max(...allP99s);

  app.println('\n' + app.bold('📈 Aggregate SLA Summary:'));
  app.printKv({
    'Total Endpoints': `${endpointMetrics.length}`,
    'Mean p99 Latency': `${avgP99.toFixed(1)} ms`,
    'Median p99 Latency': `${medianP99.toFixed(1)} ms`,
    'Worst-case Outlier': `${maxP99} ms`,
    'Overall Health': avgP99 < 150 ? app.green('HEALTHY (Within SLA)') : app.yellow('DEGRADED'),
  });
}
