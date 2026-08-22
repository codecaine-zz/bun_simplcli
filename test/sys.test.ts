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

  it('handles native Bun file I/O, JSON, and directory operations', async () => {
    const tmpDir = sys.tempDir('bun_fs_test_');
    sys.ensureDir(tmpDir);

    const testFile = `${tmpDir}/sample.json`;
    const testData = { name: 'SimpleCLI', version: '1.5.0', active: true, count: 42 };

    await sys.writeJson(testFile, testData);
    expect(await sys.fileExists(testFile)).toBe(true);
    expect(sys.fileSize(testFile)).toBeGreaterThan(0);
    expect(sys.fileMime(testFile)).toContain('application/json');

    const readData = await sys.readJson<{ name: string; version: string }>(testFile);
    expect(readData.name).toBe('SimpleCLI');
    expect(readData.version).toBe('1.5.0');

    const syncReadData = sys.readJsonSync<{ active: boolean }>(testFile);
    expect(syncReadData.active).toBe(true);

    const txtFile = `${tmpDir}/test.txt`;
    await sys.write(txtFile, 'Hello Bun Native I/O');
    expect(await sys.readText(txtFile)).toBe('Hello Bun Native I/O');
    expect(sys.readTextSync(txtFile)).toBe('Hello Bun Native I/O');

    await sys.append(txtFile, '\nAppended Line');
    expect(await sys.readText(txtFile)).toContain('Appended Line');

    const bytes = await sys.readBytes(txtFile);
    expect(bytes instanceof Uint8Array).toBe(true);
    expect(bytes.length).toBeGreaterThan(0);

    expect(sys.deleteFile(txtFile)).toBe(true);
    expect(await sys.fileExists(txtFile)).toBe(false);
  });

  it('resolves system binaries and environment variables', () => {
    const bunPath = sys.which('bun');
    expect(bunPath).not.toBeNull();
    expect(sys.hasBinary('bun')).toBe(true);
    expect(sys.hasBinary('definitely_nonexistent_binary_xyz_123')).toBe(false);

    sys.setEnv('SIMPLCLI_TEST_VAR', 'val_42');
    expect(sys.getEnv('SIMPLCLI_TEST_VAR')).toBe('val_42');
    expect(sys.requireEnv('SIMPLCLI_TEST_VAR')).toBe('val_42');
    expect(() => sys.requireEnv('SIMPLCLI_NON_EXISTENT_VAR_XYZ')).toThrow();
  });

  it('measures execution duration and benchmarking', async () => {
    const syncBench = sys.measure(() => {
      let sum = 0;
      for (let i = 0; i < 1000; i++) sum += i;
      return sum;
    });
    expect(syncBench.result).toBe(499500);
    expect(syncBench.durationNs).toBeGreaterThan(0);
    expect(syncBench.durationMs).toBeGreaterThanOrEqual(0);

    const asyncBench = await sys.measureAsync(async () => {
      await sys.sleep(10);
      return 'done';
    });
    expect(asyncBench.result).toBe('done');
    expect(asyncBench.durationMs).toBeGreaterThanOrEqual(5);
  });

  it('computes fast native hashes, checksums, and compression', () => {
    const raw = 'The quick brown fox jumps over the lazy dog';
    const hash = sys.fastHash(raw);
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);

    const crc = sys.crc32(raw);
    expect(typeof crc).toBe('number');
    expect(crc).toBe(1095738169);

    const adler = sys.adler32(raw);
    expect(typeof adler).toBe('number');

    // Gzip / Gunzip
    const compressed = sys.gzip(raw);
    expect(compressed instanceof Uint8Array).toBe(true);
    const decompressed = sys.gunzip(compressed);
    expect(new TextDecoder().decode(decompressed)).toBe(raw);

    // Deflate / Inflate
    const deflated = sys.deflate(raw);
    const inflated = sys.inflate(deflated);
    expect(new TextDecoder().decode(inflated)).toBe(raw);
  });

  it('checks semantic versions and Bun runtime metadata', () => {
    expect(sys.bunVersion().length).toBeGreaterThan(0);
    expect(sys.semverSatisfies('1.4.0', '>=1.0.0')).toBe(true);
    expect(sys.semverCompare('1.4.0', '1.3.0')).toBeGreaterThan(0);
  });

  it('provides convenience helpers on SimpleCLI instance', async () => {
    const { SimpleCLI } = await import('../src/index.ts');
    const app = SimpleCLI.newApp('AppHelpersTest', '1.0.0');

    expect(app.hasBinary('bun')).toBe(true);
    expect(app.which('bun')).not.toBeNull();

    const tmp = sys.tempFile('app_helper_', '.json');
    await app.writeJson(tmp, { key: 'app_val' });
    const res = await app.readJson(tmp);
    expect(res.key).toBe('app_val');

    const bench = await app.measureAsync(async () => {
      await app.sleep(5);
      return 123;
    });
    expect(bench.result).toBe(123);
    expect(bench.durationMs).toBeGreaterThanOrEqual(2);
  });
});

