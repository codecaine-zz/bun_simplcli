#!/usr/bin/env bun
/**
 * Template 5: System Telemetry & Hardware Monitor
 *
 * Demonstrates:
 * - Real-time CPU, RAM, OS, and network stats via `sys`
 * - Hardware information formatting with key-value pairs
 * - Process execution with `sys.exec`
 * - Network port availability checking
 * - Desktop system notifications
 *
 * Usage:
 *   bun run templates/05_system_monitor.ts
 */

import { SimpleCLI, sys, stdlib } from '../src/index.ts';

const app = SimpleCLI.newApp('sysmon', '1.0.0')
  .setDescription('System hardware & runtime telemetry dashboard');

async function main() {
  app.banner('System Hardware Telemetry', `${sys.osPlatform()} (${sys.osArch()}) - Kernel ${sys.osRelease()}`);

  // 1. Gather Telemetry Metrics
  const cpuCount = sys.cpuCount();
  const cpuLoad = sys.cpuLoad();
  const ramTotal = sys.ramTotal();
  const ramUsed = sys.ramUsed();
  const ramFree = sys.ramFree();
  const uptime = sys.osUptime();
  const localIp = sys.localIp();
  const hostname = sys.osHostname();

  // 2. Format with PrintKV
  app.println(app.bold('💻 Hardware & Host Information'));
  app.printKv({
    'Host Name': hostname,
    'Platform / Arch': `${sys.osPlatform()} / ${sys.osArch()}`,
    'CPU Cores': `${cpuCount} logical cores`,
    'System Uptime': stdlib.formatDuration(uptime * 1000),
    'Local IP Address': localIp,
    'Total Memory': stdlib.formatBytes(ramTotal),
    'Used Memory': stdlib.formatBytes(ramUsed),
    'Free Memory': stdlib.formatBytes(ramFree),
  });

  // 3. Visual Resource Gauges
  app.println('\n' + app.bold('📊 Utilization Gauges'));
  const ramUsedGb = Number((ramUsed / 1024 / 1024 / 1024).toFixed(2));
  const ramTotalGb = Number((ramTotal / 1024 / 1024 / 1024).toFixed(2));
  app.gauge('RAM Usage', ramUsedGb, ramTotalGb, 'GB');
  app.gauge('CPU Load (1m avg)', Number((cpuLoad[0] * 100).toFixed(1)), 100.0, '%');

  // 4. Check Port Health
  app.println('\n' + app.bold('🔌 Port Health Check'));
  const portToCheck = 8080;
  const isPortOpen = await sys.checkPort('127.0.0.1', portToCheck);
  app.println(
    `  Port ${portToCheck} on localhost: ` +
    (isPortOpen ? app.green('OPEN (Active Listener)') : app.dim('CLOSED (Available)'))
  );

  // 5. Optional Desktop Notification
  try {
    sys.notify('SysMon Complete', `Telemetry collected successfully for ${hostname}`);
  } catch {
    // Ignore notification errors in headless/CI environments
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
