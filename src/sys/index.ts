/**
 * Cross-platform OS system calls, hardware telemetry, process management, and network diagnostics for Bun
 */

import { type ExecResult, type DiskStats, type FileMetadata } from '../core/types.ts';
import * as os from 'node:os';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as net from 'node:net';
import { spawnSync, spawn } from 'node:child_process';

export class Sys {
  // ===========================================================================
  // 1. Process Execution & Subprocess Control
  // ===========================================================================

  public static exec(command: string, cwd?: string): [string, number] {
    try {
      const res = spawnSync(command, {
        shell: true,
        cwd: cwd || process.cwd(),
        encoding: 'utf8',
        env: process.env,
      });
      const stdout = (res.stdout || '').trim();
      const stderr = (res.stderr || '').trim();
      const output = stdout || stderr;
      return [output, res.status ?? (res.error ? 1 : 0)];
    } catch (err: any) {
      return [err?.message || String(err), 1];
    }
  }

  public static execOr(command: string, fallback: string = '', cwd?: string): string {
    const [out, code] = Sys.exec(command, cwd);
    return code === 0 && out.length > 0 ? out : fallback;
  }

  public static execBg(command: string, cwd?: string): number | undefined {
    try {
      const proc = spawn(command, {
        shell: true,
        cwd: cwd || process.cwd(),
        detached: true,
        stdio: 'ignore',
      });
      proc.unref();
      return proc.pid;
    } catch {
      return undefined;
    }
  }

  public static execInDir(dir: string, command: string): [string, number] {
    return Sys.exec(command, dir);
  }

  public static async execTimeout(command: string, timeoutMs: number = 5000, cwd?: string): Promise<ExecResult> {
    const start = performance.now();
    return new Promise((resolve) => {
      let timedOut = false;
      const proc = spawn(command, {
        shell: true,
        cwd: cwd || process.cwd(),
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (d) => { stdout += d.toString(); });
      proc.stderr?.on('data', (d) => { stderr += d.toString(); });

      const timer = setTimeout(() => {
        timedOut = true;
        proc.kill('SIGKILL');
      }, timeoutMs);

      proc.on('close', (code) => {
        clearTimeout(timer);
        const durationMs = Math.round(performance.now() - start);
        resolve({
          output: (stdout || stderr).trim(),
          exitCode: timedOut ? 124 : (code ?? 0),
          durationMs,
          timedOut,
          attempts: 1,
        });
      });

      proc.on('error', (err) => {
        clearTimeout(timer);
        resolve({
          output: err.message,
          exitCode: 1,
          durationMs: Math.round(performance.now() - start),
          timedOut: false,
          attempts: 1,
        });
      });
    });
  }

  public static async execRetry(command: string, maxRetries: number = 3, delayMs: number = 500, cwd?: string): Promise<ExecResult> {
    const start = performance.now();
    let attempts = 0;
    let lastOut = '';
    let lastCode = 1;

    while (attempts < maxRetries) {
      attempts++;
      const [out, code] = Sys.exec(command, cwd);
      lastOut = out;
      lastCode = code;

      if (code === 0) {
        return {
          output: out,
          exitCode: 0,
          durationMs: Math.round(performance.now() - start),
          timedOut: false,
          attempts,
        };
      }

      if (attempts < maxRetries) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }

    return {
      output: lastOut,
      exitCode: lastCode,
      durationMs: Math.round(performance.now() - start),
      timedOut: false,
      attempts,
    };
  }

  public static async execParallel(commands: string[], concurrency: number = 4): Promise<[string, number][]> {
    const results: [string, number][] = new Array(commands.length);
    let index = 0;

    const worker = async () => {
      while (index < commands.length) {
        const i = index++;
        results[i] = Sys.exec(commands[i]);
      }
    };

    const workers = Array.from({ length: Math.min(concurrency, commands.length) }, () => worker());
    await Promise.all(workers);
    return results;
  }

  public static killProcess(pid: number, signal: NodeJS.Signals = 'SIGTERM'): boolean {
    try {
      process.kill(pid, signal);
      return true;
    } catch {
      return false;
    }
  }

  // ===========================================================================
  // 2. Hardware Telemetry & Resource Probing
  // ===========================================================================

  public static cpuCount(): number {
    return os.cpus().length || 1;
  }

  public static cpuModel(): string {
    return os.cpus()[0]?.model || 'Unknown CPU';
  }

  public static cpuLoad(): [number, number, number] {
    const load = os.loadavg();
    return [load[0], load[1], load[2]];
  }

  public static ramTotal(): number {
    return os.totalmem();
  }

  public static ramFree(): number {
    return os.freemem();
  }

  public static ramUsed(): number {
    return os.totalmem() - os.freemem();
  }

  public static ramPercent(): number {
    const total = os.totalmem();
    if (total === 0) return 0;
    return Number(((Sys.ramUsed() / total) * 100).toFixed(1));
  }

  public static osPlatform(): string {
    return os.platform();
  }

  public static osArch(): string {
    return os.arch();
  }

  public static osRelease(): string {
    return os.release();
  }

  public static osHostname(): string {
    return os.hostname();
  }

  public static osHomedir(): string {
    return os.homedir();
  }

  public static osTmpdir(): string {
    return os.tmpdir();
  }

  public static osUptime(): number {
    return os.uptime();
  }

  public static batteryPercent(): number {
    const p = os.platform();
    if (p === 'darwin') {
      const out = Sys.execOr('pmset -g batt', '');
      const match = out.match(/(\d+)%/);
      if (match) return parseInt(match[1], 10);
    } else if (p === 'linux') {
      try {
        const cap = fs.readFileSync('/sys/class/power_supply/BAT0/capacity', 'utf8');
        return parseInt(cap.trim(), 10);
      } catch {
        // fallback
      }
    }
    return 100;
  }

  public static isCharging(): boolean {
    const p = os.platform();
    if (p === 'darwin') {
      const out = Sys.execOr('pmset -g batt', '');
      return out.includes('charging') || out.includes('AC Power');
    } else if (p === 'linux') {
      try {
        const status = fs.readFileSync('/sys/class/power_supply/BAT0/status', 'utf8');
        return status.trim().toLowerCase() === 'charging';
      } catch {
        // fallback
      }
    }
    return true;
  }

  // ===========================================================================
  // 3. File System Helpers
  // ===========================================================================

  public static expandTilde(filePath: string): string {
    if (filePath.startsWith('~')) {
      return path.resolve(os.homedir(), filePath.slice(1).replace(/^[/\\]/, ''));
    }
    return path.resolve(filePath);
  }

  public static diskStats(targetPath: string = '/'): DiskStats {
    try {
      const [out, code] = Sys.exec(`df -k "${targetPath}"`);
      if (code === 0) {
        const lines = out.trim().split('\n');
        if (lines.length >= 2) {
          const parts = lines[lines.length - 1].split(/\s+/);
          if (parts.length >= 5) {
            const totalBytes = (parseInt(parts[1], 10) || 0) * 1024;
            const usedBytes = (parseInt(parts[2], 10) || 0) * 1024;
            const freeBytes = (parseInt(parts[3], 10) || 0) * 1024;
            const pctStr = parts[4].replace('%', '');
            const percent = parseFloat(pctStr) || (totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0);
            return { totalBytes, usedBytes, freeBytes, percent: Number(percent.toFixed(1)) };
          }
        }
      }
    } catch {
      // fallback
    }

    const totalBytes = 100 * 1024 * 1024 * 1024;
    return { totalBytes, usedBytes: 40 * 1024 * 1024 * 1024, freeBytes: 60 * 1024 * 1024 * 1024, percent: 40.0 };
  }

  public static fileMetadata(filePath: string): FileMetadata | null {
    const fullPath = Sys.expandTilde(filePath);
    if (!fs.existsSync(fullPath)) return null;

    try {
      const st = fs.statSync(fullPath);
      let isReadable = false;
      let isWritable = false;
      try {
        fs.accessSync(fullPath, fs.constants.R_OK);
        isReadable = true;
      } catch {}
      try {
        fs.accessSync(fullPath, fs.constants.W_OK);
        isWritable = true;
      } catch {}

      return {
        path: fullPath,
        name: path.basename(fullPath),
        sizeBytes: st.size,
        isDir: st.isDirectory(),
        isLink: st.isSymbolicLink(),
        isReadable,
        isWritable,
        createdTime: Math.round(st.birthtimeMs),
        modifiedTime: Math.round(st.mtimeMs),
      };
    } catch {
      return null;
    }
  }

  public static tempFile(prefix: string = 'tmp_', suffix: string = ''): string {
    const rand = Math.random().toString(36).substring(2, 8);
    const fileName = `${prefix}${Date.now()}_${rand}${suffix}`;
    return path.join(os.tmpdir(), fileName);
  }

  public static tempDir(prefix: string = 'tmp_dir_'): string {
    const dirPath = Sys.tempFile(prefix);
    fs.mkdirSync(dirPath, { recursive: true });
    return dirPath;
  }

  public static touch(filePath: string): void {
    const full = Sys.expandTilde(filePath);
    const dir = path.dirname(full);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const now = new Date();
    try {
      fs.utimesSync(full, now, now);
    } catch {
      fs.closeSync(fs.openSync(full, 'w'));
    }
  }

  public static chmod(filePath: string, mode: number | string): void {
    const full = Sys.expandTilde(filePath);
    fs.chmodSync(full, mode);
  }

  public static findFiles(rootDir: string, pattern?: RegExp | string): string[] {
    const results: string[] = [];
    const root = Sys.expandTilde(rootDir);
    if (!fs.existsSync(root)) return results;

    const regex = pattern ? (typeof pattern === 'string' ? new RegExp(pattern) : pattern) : null;

    const scan = (dir: string) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            scan(full);
          } else {
            if (!regex || regex.test(entry.name) || regex.test(full)) {
              results.push(full);
            }
          }
        }
      } catch {
        // Skip inaccessible dirs
      }
    };

    scan(root);
    return results;
  }

  // ===========================================================================
  // 4. Network Diagnostics & Port Probing
  // ===========================================================================

  public static networkInterfaces(): Record<string, string[]> {
    const ifaces = os.networkInterfaces();
    const result: Record<string, string[]> = {};
    for (const [name, addrs] of Object.entries(ifaces)) {
      if (addrs) {
        result[name] = addrs.map(a => a.address);
      }
    }
    return result;
  }

  public static localIp(): string {
    const ifaces = os.networkInterfaces();
    for (const addrs of Object.values(ifaces)) {
      if (addrs) {
        for (const a of addrs) {
          if (!a.internal && a.family === 'IPv4') {
            return a.address;
          }
        }
      }
    }
    return '127.0.0.1';
  }

  public static macAddress(): string {
    const ifaces = os.networkInterfaces();
    for (const addrs of Object.values(ifaces)) {
      if (addrs) {
        for (const a of addrs) {
          if (!a.internal && a.mac && a.mac !== '00:00:00:00:00:00') {
            return a.mac;
          }
        }
      }
    }
    return '00:00:00:00:00:00';
  }

  public static wifiSsid(): string {
    const p = os.platform();
    if (p === 'darwin') {
      const out = Sys.execOr('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I', '');
      const match = out.match(/\bSSID:\s*(.+)/);
      if (match) return match[1].trim();
      const out2 = Sys.execOr('networksetup -getairportnetwork en0', '');
      const match2 = out2.match(/Current Wi-Fi Network:\s*(.+)/);
      if (match2) return match2[1].trim();
    } else if (p === 'linux') {
      return Sys.execOr('iwgetid -r', 'Unknown Wi-Fi');
    }
    return 'Wi-Fi Connected';
  }

  public static async pingCheck(host: string = '8.8.8.8', timeoutMs: number = 2000): Promise<boolean> {
    const p = os.platform();
    const flag = p === 'win32' ? '-n 1 -w' : '-c 1 -W';
    const timeoutSec = Math.max(1, Math.round(timeoutMs / 1000));
    const [_, code] = Sys.exec(`ping ${flag} ${timeoutSec} ${host}`);
    return code === 0;
  }

  public static async checkPort(host: string, port: number, timeoutMs: number = 1000): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeoutMs);

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(port, host);
    });
  }

  public static async portScan(host: string, startPort: number, endPort: number, timeoutMs: number = 600): Promise<number[]> {
    const openPorts: number[] = [];
    const ports: number[] = [];
    for (let p = startPort; p <= endPort; p++) ports.push(p);

    const concurrency = 20;
    let idx = 0;

    const worker = async () => {
      while (idx < ports.length) {
        const port = ports[idx++];
        const isOpen = await Sys.checkPort(host, port, timeoutMs);
        if (isOpen) {
          openPorts.push(port);
        }
      }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));
    return openPorts.sort((a, b) => a - b);
  }

  // ===========================================================================
  // 5. Desktop Notifications, Audio & Speech
  // ===========================================================================

  public static notify(title: string, message: string, sound: boolean = true): void {
    const p = os.platform();
    if (p === 'darwin') {
      const soundArg = sound ? ' sound name "default"' : '';
      const script = `display notification "${message.replace(/"/g, '\\"')}" with title "${title.replace(/"/g, '\\"')}"${soundArg}`;
      Sys.exec(`osascript -e '${script}'`);
    } else if (p === 'linux') {
      Sys.exec(`notify-send "${title.replace(/"/g, '\\"')}" "${message.replace(/"/g, '\\"')}"`);
    }
  }

  public static say(text: string, voice?: string, rate?: number): void {
    const p = os.platform();
    if (p === 'darwin') {
      const voiceArg = voice ? ` -v "${voice}"` : '';
      const rateArg = rate ? ` -r ${rate}` : '';
      Sys.execBg(`say${voiceArg}${rateArg} "${text.replace(/"/g, '\\"')}"`);
    } else if (p === 'linux') {
      Sys.execBg(`spd-say "${text.replace(/"/g, '\\"')}" || espeak "${text.replace(/"/g, '\\"')}"`);
    }
  }

  public static beep(): void {
    process.stdout.write('\x07');
  }

  public static clipboardCopy(text: string): boolean {
    const p = os.platform();
    if (p === 'darwin') {
      try {
        const res = spawnSync('pbcopy', { input: text, encoding: 'utf8' });
        return res.status === 0;
      } catch { return false; }
    } else if (p === 'linux') {
      try {
        const res = spawnSync('xclip', ['-selection', 'clipboard'], { input: text, encoding: 'utf8' });
        return res.status === 0;
      } catch { return false; }
    }
    return false;
  }

  public static clipboardPaste(): string {
    const p = os.platform();
    if (p === 'darwin') {
      return Sys.execOr('pbpaste', '');
    } else if (p === 'linux') {
      return Sys.execOr('xclip -selection clipboard -o', '');
    }
    return '';
  }

  public static openUrl(urlOrPath: string): boolean {
    const p = os.platform();
    const cmd = p === 'darwin' ? 'open' : (p === 'win32' ? 'start' : 'xdg-open');
    const [_, code] = Sys.exec(`${cmd} "${urlOrPath}"`);
    return code === 0;
  }
}

export const sys = Sys;
