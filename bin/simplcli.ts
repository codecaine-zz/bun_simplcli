#!/usr/bin/env bun
/**
 * Unified CLI Runner & Dispatcher for SimpleCLI Suite of 49 Tools
 */

import { SimpleCLI, Ansi } from '../src/index.ts';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawn } from 'node:child_process';

const app = SimpleCLI.newApp('simplcli', '1.0.0')
  .setDescription('Unified Dispatcher & Interactive Terminal Suite for Bun');

app.addFlagBool('list', 'l', false, 'List all 49 pre-built CLI applications');

const args = process.argv.slice(2);
const cliAppsDir = path.resolve(import.meta.dir, '..', 'cli_apps');

const availableApps = fs.readdirSync(cliAppsDir)
  .filter(f => f.endsWith('.ts') && f !== 'README.md')
  .map(f => f.replace(/\.ts$/, ''));

if (args.length === 0 || args[0] === '-l' || args[0] === '--list') {
  app.banner('SimpleCLI Toolkit for Bun', '49 Zero-Dependency Production CLI Tools');

  const rows: [string, string][] = [
    ['api_stress_bench', 'HTTP benchmark & latency stress tester with statistical distribution'],
    ['api_studio_cli', 'Interactive REST API client & request builder'],
    ['app_bundler_cli', 'macOS native .app bundle packager & generator'],
    ['audiotag_cli', 'Audio file ID3 & metadata tag inspector'],
    ['brew_cli', 'Homebrew package manager assistant & health dashboard'],
    ['calc_cli', 'Programmer calculator (HEX, DEC, OCT, BIN, Bitwise Ops)'],
    ['crypto_cli', 'Cryptographic hash (MD5/SHA256/BCrypt) & AES-256 studio'],
    ['cut_cli', 'Stream & file column/field cutting utility'],
    ['dataconvert_cli', 'Tabular data format converter (CSV, JSON, Markdown, TSV)'],
    ['devops_sentinel', 'System resource guardian & hardware telemetry sentinel'],
    ['disk_cli', 'Disk storage capacity & partition usage visualizer'],
    ['dns_cli', 'DNS lookup, nameserver & latency inspector'],
    ['docker_cli', 'Docker container & image management dashboard'],
    ['dot_cli', 'Dotfiles manager & config symlink synchronizer'],
    ['exif_cli', 'Image EXIF metadata inspector & stripper'],
    ['fd_cli', 'Fast filesystem search & directory traversal tool'],
    ['ffmpeg_cli', 'Video & audio transcoding preset pipeline helper'],
    ['find_cli', 'UNIX-like file hierarchy search utility'],
    ['gawk_cli', 'Pattern scanning & text processing engine'],
    ['graph_cli', 'Terminal Unicode graph, bar chart & sparkline visualizer'],
    ['ifconfig_cli', 'Network interface & IP configuration inspector'],
    ['imagemagick_cli', 'Batch image converter, resizer & thumbnail engine'],
    ['jq_cli', 'JSON query, filter, and syntax highlighter'],
    ['kalker_cli', 'Scientific mathematics & calculus calculator'],
    ['launchd_cli', 'macOS launchd service manager & supervisor'],
    ['media_studio_cli', 'Multi-purpose media production toolkit'],
    ['multirepo_git_pilot', 'Multi-repository Git orchestrator'],
    ['nmap_cli', 'TCP port scanner & service discovery tool'],
    ['numbat_cli', 'Physical unit & dimensional physics calculator'],
    ['ocr_cli', 'Optical character recognition text extractor'],
    ['ouch_cli', 'Universal archive compressor & decompressor'],
    ['pandoc_cli', 'Universal document & markup converter'],
    ['qalc_cli', 'Advanced equation solver & algebraic calculator'],
    ['recon_cli', 'Security & network reconnaissance suite'],
    ['regex_cli', 'Regular expression tester & capture group visualizer'],
    ['rg_cli', 'Fast recursive code & text search (ripgrep style)'],
    ['say_cli', 'Text-to-speech voice synthesis CLI'],
    ['sd_cli', 'Search & replace text utility with line diffs'],
    ['sed_cli', 'Stream editor & line transformation utility'],
    ['sqlite_cli', 'SQLite database explorer & table formatter'],
    ['statistics_cli', 'Statistical analysis & metrics engine'],
    ['subfinder_cli', 'Subdomain discovery & DNS enumeration tool'],
    ['task_manager_cli', 'Terminal task checklist & productivity manager'],
    ['terminal_recorder_studio', 'Terminal recording assistant & VHS tape generator'],
    ['text_editor_cli', 'Zero-dependency console text viewer & editor'],
    ['tr_cli', 'Character translation & transformation utility'],
    ['vault_backup_manager', 'Encrypted backup & restore manager (AES-256)'],
    ['wget2_cli', 'Fast HTTP file downloader with progress bar'],
    ['yt_dlp_cli', 'Media download orchestrator & quality preset engine'],
  ];

  if (args[0] === '-l' || args[0] === '--list') {
    app.table(['CLI Application', 'Description'], rows);
    process.exit(0);
  }

  // Interactive selection if no args
  (async () => {
    const selected = await app.fuzzySelect('Search & launch a CLI tool:', availableApps);
    if (!selected) process.exit(0);
    const targetScript = path.join(cliAppsDir, `${selected}.ts`);
    const proc = spawn('bun', [targetScript], { stdio: 'inherit' });
    proc.on('close', (code) => process.exit(code ?? 0));
  })();
} else {
  // Command dispatched
  const requestedApp = args[0].replace(/\.(ts|v)$/, '');
  const matchingApp = availableApps.find(a => a === requestedApp || a.startsWith(requestedApp) || a.replace(/_cli$/, '') === requestedApp);

  if (!matchingApp) {
    console.error(Ansi.red(`Unknown CLI application "${args[0]}". Run "simplcli --list" to view all available tools.`));
    process.exit(1);
  }

  const targetScript = path.join(cliAppsDir, `${matchingApp}.ts`);
  const proc = spawn('bun', [targetScript, ...args.slice(1)], { stdio: 'inherit' });
  proc.on('close', (code) => process.exit(code ?? 0));
}
