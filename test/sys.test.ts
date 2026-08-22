import { describe, it, expect } from 'bun:test';
import { sys } from '../src/index.ts';

describe('Sys Telemetry, Process Management & File System Tests', () => {
  it('executes commands synchronously and asynchronously', async () => {
    const [out, code] = sys.exec('echo "Hello Bun Sys"');
    expect(code).toBe(0);
    expect(out).toContain('Hello Bun Sys');

    const fallback = sys.execOr('non_existent_command_12345', 'default_fallback');
    expect(fallback).toBe('default_fallback');

    const timeoutRes = await sys.execTimeout('sleep 2', 500);
    expect(timeoutRes.timedOut).toBe(true);

    const retryRes = await sys.execRetry('echo "retry ok"', 3, 50);
    expect(retryRes.exitCode).toBe(0);
  });

  it('collects hardware resource telemetry', () => {
    expect(sys.cpuCount()).toBeGreaterThanOrEqual(1);
    expect(sys.cpuModel().length).toBeGreaterThan(0);
    expect(sys.ramTotal()).toBeGreaterThan(0);
    expect(sys.ramFree()).toBeGreaterThan(0);
    expect(sys.ramPercent()).toBeGreaterThanOrEqual(0);
    expect(sys.osPlatform().length).toBeGreaterThan(0);
    expect(sys.osArch().length).toBeGreaterThan(0);
    expect(sys.osUptime()).toBeGreaterThanOrEqual(0);
  });

  it('inspects filesystem and temp files', () => {
    const tmp = sys.tempFile('test_', '.txt');
    sys.touch(tmp);
    const meta = sys.fileMetadata(tmp);
    expect(meta).not.toBeNull();
    expect(meta?.isDir).toBe(false);
    expect(meta?.name).toContain('test_');

    const disk = sys.diskStats('/');
    expect(disk.totalBytes).toBeGreaterThan(0);
    expect(disk.percent).toBeGreaterThanOrEqual(0);
  });

  it('inspects network adapters and IPs', () => {
    const ifaces = sys.networkInterfaces();
    expect(Object.keys(ifaces).length).toBeGreaterThan(0);
    const ip = sys.localIp();
    expect(ip.length).toBeGreaterThan(0);
  });
});
