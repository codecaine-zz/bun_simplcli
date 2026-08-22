# SimpleCLI: Headless Console & RAD Toolkit for Bun

[![Runtime](https://img.shields.io/badge/Runtime-Bun-f472b6.svg)](https://bun.sh)
[![Language](https://img.shields.io/badge/Language-TypeScript-3178c6.svg)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(100%25%20Native)-blue.svg)]()
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey.svg)]()

**SimpleCLI for Bun** is a comprehensive, lightweight, zero-dependency console utility framework and Rapid Application Development (RAD) toolkit built natively for the **Bun JavaScript/TypeScript runtime**.

It delivers cross-platform OS system telemetry, hardware resource monitoring, desktop notifications, speech synthesis, standard path resolvers, high-speed cryptography (via `Bun.CryptoHasher` and `Bun.password`), interactive prompts (select, multi-select, fuzzy search, form wizards), multi-step task pipelines with animated spinners, structured multi-level logging, CLI flag parsing, and a complete suite of **49 pre-built production CLI applications**.

---

## 🎬 Live Demos & Terminal Recordings

### 🧮 Mathematics & Scientific Computing Suite

![SimpleCLI Mathematics Suite](assets/math_suite.gif)

### 🚀 Bun SimpleCLI Full Showcase

![Bun SimpleCLI Showcase](assets/bun_simplcli_demo.gif)

<details>
<summary><b>📺 Individual Mathematical, Calculus & Developer Tool Recordings (Click to Expand)</b></summary>
<br>

| Application | Themed VHS Preview | Description |
| :--- | :--- | :--- |
| **Kalker Scientific & Calculus**<br>_Trigonometry, Calculus (d/dx, ∫) & Constants_ | ![Kalker Demo](assets/kalker_demo.gif) | Numerical differentiation & integration |
| **Programmer Calculator**<br>_Base Radix & Bitwise Engine_ | ![Calc Demo](assets/calc_demo.gif) | 64-bit Hex, Octal, Binary & Bitwise ops |
| **Statistics Studio**<br>_Central Tendency, RMS & StdDev_ | ![Stats Demo](assets/stats_demo.gif) | Mean, median, variance & sparklines |
| **Terminal Graph Visualizer**<br>_Distribution Charts & Bar Graphs_ | ![Graph Demo](assets/graph_demo.gif) | ASCII/Unicode terminal graphs & distributions |
| **Crypto Studio**<br>_SHA-256 & AES-256 Encryption_ | ![Crypto Demo](assets/crypto_demo.gif) | Native hashing & AES-256 symmetric encryption |
| **Namespaced Redis Manager**<br>_Multi-Tenant Isolation & Keys_ | ![Redis Demo](assets/redis_demo.gif) | Zero-overhead key prefixing, isolated tenants & inspection |

</details>

### 📼 Recording Your Own Demos with VHS

You can re-render all VHS tapes using the built-in scripts:

```bash
# Render all VHS tape scripts to assets/
vhs scripts/tapes/math_suite.tape
vhs scripts/tapes/bun_simplcli_showcase.tape
vhs scripts/tapes/kalker.tape
vhs scripts/tapes/calc.tape
vhs scripts/tapes/stats.tape
vhs scripts/tapes/graph.tape
vhs scripts/tapes/crypto.tape
vhs scripts/tapes/redis.tape


# Or run the live demonstration shell script
./scripts/demo_showcase.sh
./scripts/math_showcase.sh
```

---

## 📑 Table of Contents

- [Live Demos & Terminal Recordings](#-live-demos--terminal-recordings)
- [Features](#-features)
- [Installation & Setup](#-installation--setup)
- [Quick Start](#-quick-start)
- [Console UI & RAD Components](#-console-ui--rad-components)
  - [Terminal ANSI & TrueColor Styling](#terminal-ansi--truecolor-styling)
  - [Steps, Dividers, Banners & Panels](#steps-dividers-banners--panels)
  - [Key-Value Pairs & Formatted Tables](#key-value-pairs--formatted-tables)
  - [Progress Bars & Animated Spinners](#progress-bars--animated-spinners)
  - [Unicode Sparklines & Bar Charts](#unicode-sparklines--bar-charts)
  - [Meter Gauges & Threshold Badges](#meter-gauges--threshold-badges)
  - [Hierarchical Tree Visualizer](#hierarchical-tree-visualizer)
  - [Colorized Line Diff Viewer](#colorized-line-diff-viewer)
  - [Interactive Prompts, Selects & Forms](#interactive-prompts-selects--forms)
  - [Multi-Step Task Pipeline Runner](#multi-step-task-pipeline-runner)
- [Hardware & Telemetry](#-hardware--telemetry)
- [Extended Standard Library](#-extended-standard-library)
- [Complete Suite of 49 CLI Applications](#-complete-suite-of-49-cli-applications)
- [Running Tests](#-running-tests)
- [API Reference](#-api-reference)

---

## ✨ Features

- 🚀 **Zero External Runtime Dependencies**: 100% native Bun APIs and modern TypeScript standard library.
- 🎨 **Rich RAD Console UI**: Framed panels, Unicode data tables, ASCII banners, status badges, GitHub-style alert boxes, sparklines, meter gauges, hierarchical trees, and colored line diffs.
- 🎛️ **Interactive Terminal Prompts**: Keyboard arrow-navigated single/multi-select menus, live fuzzy search, masked password prompts, email/URL validators, and multi-field form wizards.
- ⚡ **Multi-Step Pipelines**: Chained workflow execution with step spinners, precise timers, and summary reporting.
- 🪵 **Structured Multi-Level Logging**: Trace, Debug, Info, Success, Warn, Error, and Fatal logging with automatic timestamps and file streaming.
- 📊 **Hardware & Telemetry**: CPU load averages, RAM allocation, disk capacity, Wi-Fi SSID, network IP addresses, and TCP port scanner.
- 🔒 **Security & Cryptography**: Native SHA-256/512/MD5, AES-256-CBC encryption/decryption, HMAC, native BCrypt/Argon2 (via `Bun.password`), and UUID v4 / UUID v7.
- 🌐 **HTTP & Networking**: REST API client with status codes, headers, and file downloads with live progress bars.
- 📦 **Generic Data Structures**: Stack, Queue, SetCollection, RingBuffer, MinHeap, PriorityQueue, and LRUCache.
- 🧮 **Statistics & Math**: Mean, median, mode, standard deviation, RMS, variance, and numeric aggregations.
- 🔴 **Native Namespaced Redis Wrapper**: Multi-tenant key isolation, typed JSON, sub-namespaces, hashes, sets, distributed locks, and pub/sub.
- 🛠️ **54 Pre-Built Production CLI Tools**: Ready-to-run utilities for DevOps, security, databases, text processing, media, and mathematics.


---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/codecaine-zz/bun_simplcli.git
cd bun_simplcli

# Run tests
bun test

# Launch the unified CLI suite
bun run start
```

---

## 🚀 Quick Start

```typescript
import { SimpleCLI } from 'bun-simplcli';

const app = SimpleCLI.newApp('DeployPilot', '1.0.0')
  .setDescription('Cloud Infrastructure Deployment Automation');

// Define CLI Flags
app.addFlagString('env', 'e', 'staging', 'Target deployment environment (staging|prod)');
app.addFlagInt('port', 'p', 8080, 'Listening port number');
app.addFlagBool('dry-run', 'd', false, 'Simulate deployment without modifying resources');

if (!app.parseCli()) process.exit(0);

const targetEnv = app.getFlagString('env');
const isDryRun = app.getFlagBool('dry-run');

app.banner('DeployPilot Cloud Runner', `Target: ${targetEnv}`);

app.step(1, 'Validating Credentials');
app.success('Authentication tokens verified');

app.step(2, 'Running Infrastructure Pipeline');
const pipeline = app.newPipeline('Deployment Stages');
pipeline.addStep('Provision compute instances', async () => true);
pipeline.addStep('Apply database migrations', async () => true);
pipeline.addStep('Configure load balancer routes', async () => true);
await pipeline.run();

app.panel('Status Summary', `All deployment stages completed successfully on ${targetEnv}.`);
```

---

## 🖥️ Console UI & RAD Components

### Formatted Tables & Key-Value Pairs

```typescript
// Aligned Key-Value Dictionary
app.printKv({
  'Host Name': 'srv-prod-api-01',
  'IP Address': '10.0.4.18',
  'Architecture': 'aarch64 (Apple Silicon)',
  'Uptime': '14 days, 6 hours',
});

// Formatted Data Grid with Borders
app.table(
  ['Endpoint', 'Protocol', 'Latency', 'Status'],
  [
    ['https://api.internal/v1', 'HTTP/2', '12.4 ms', '200 OK'],
    ['https://auth.internal', 'HTTP/2', '8.1 ms', '200 OK'],
    ['postgres://10.0.0.5:5432', 'TCP', '1.2 ms', 'CONNECTED'],
    ['redis://10.0.0.9:6379', 'TCP', '0.4 ms', 'CONNECTED'],
  ]
);
```

### Sparklines & Bar Charts

```typescript
// Unicode Inline Sparkline
const latencies = [12.0, 15.0, 45.0, 90.0, 120.0, 80.0, 30.0, 14.0];
const spark = app.sparkline(latencies);
app.info(`Latency Trend: ${spark}`); // ▂▄▆█▆▂ 

// Horizontal Bar Chart
app.barChart('Resource Allocation (%)', {
  'CPU Core 0': 42.5,
  'CPU Core 1': 89.0,
  'Memory': 64.2,
  'Disk /': 23.8,
}, 30);
```

### Interactive Menus & Prompts

```typescript
// Arrow-key single select
const env = await app.select('Choose build target environment:', [
  'Local Development',
  'Staging Integration',
  'Production Release',
]);

// Live fuzzy search selector
const branch = await app.fuzzySelect('Search Git branch:', [
  'main',
  'feature/rad-components',
  'feature/graphql-api',
  'bugfix/state-persistence',
]);

// Masked secret prompt
const apiToken = await app.promptPassword('Enter secret API access token:');
```

---

## 🛠️ Complete Suite of 54 CLI Applications

Run any tool directly via `bun run bin/simplcli.ts <app-name>` or run individual scripts in `cli_apps/`:

| Application | Description |
| :--- | :--- |
| `api_stress_bench` | HTTP benchmark & latency stress tester with statistical distribution |
| `api_studio_cli` | Interactive REST API client & request builder |
| `app_bundler_cli` | macOS native `.app` bundle packager & generator |
| `audiotag_cli` | Audio file ID3 & metadata tag inspector |
| `brew_cli` | Homebrew package manager assistant & health dashboard |
| `calc_cli` | Programmer calculator (HEX, DEC, OCT, BIN, Bitwise Ops) |
| `crypto_cli` | Cryptographic hash (MD5/SHA256/BCrypt) & AES-256 studio |
| `cut_cli` | Stream & file column/field cutting utility |
| `dataconvert_cli` | Tabular data format converter (CSV, JSON, Markdown, TSV) |
| `devops_sentinel` | System resource guardian & hardware telemetry sentinel |
| `disk_cli` | Disk storage capacity & partition usage visualizer |
| `dns_cli` | DNS lookup, nameserver & latency inspector |
| `docker_cli` | Docker container & image management dashboard |
| `dot_cli` | Dotfiles manager & config symlink synchronizer |
| `env_cli` | Environment secret auditor, syntax validator & `.env.example` diff inspector |
| `exif_cli` | Image EXIF metadata inspector & stripper |
| `fd_cli` | Fast filesystem search & directory traversal tool |
| `ffmpeg_cli` | Video & audio transcoding preset pipeline helper |
| `find_cli` | UNIX-like file hierarchy search utility |
| `gawk_cli` | Pattern scanning & text processing engine |
| `graph_cli` | Terminal Unicode graph, bar chart & sparkline visualizer |
| `ifconfig_cli` | Network interface & IP configuration inspector |
| `imagemagick_cli` | Batch image converter, resizer & thumbnail engine |
| `jq_cli` | JSON query, filter, and syntax highlighter |
| `jwt_cli` | Zero-dependency JSON Web Token decoder & claim analyzer |
| `kalker_cli` | Scientific mathematics & calculus calculator |
| `launchd_cli` | macOS launchd service manager & supervisor |
| `media_studio_cli` | Multi-purpose media production toolkit |
| `multirepo_git_pilot` | Multi-repository Git orchestrator |
| `nmap_cli` | TCP port scanner & service discovery tool |
| `numbat_cli` | Physical unit & dimensional physics calculator |
| `ocr_cli` | Optical character recognition text extractor |
| `ouch_cli` | Universal archive compressor & decompressor |
| `pandoc_cli` | Universal document & markup converter |
| `port_kill_cli` | Inspect listening network ports & kill stuck dev server processes |
| `qalc_cli` | Advanced equation solver & algebraic calculator |
| `recon_cli` | Security & network reconnaissance suite |
| `redis_cli` | Namespaced Redis key explorer, value inspector & multi-tenant manager |
| `regex_cli` | Regular expression tester & capture group visualizer |

| `rg_cli` | Fast recursive code & text search (ripgrep style) |
| `say_cli` | Text-to-speech voice synthesis CLI |
| `sd_cli` | Search & replace text utility with line diffs |
| `sed_cli` | Stream editor & line transformation utility |
| `speedtest_cli` | Network throughput, latency, and ping benchmarker |
| `sqlite_cli` | SQLite database explorer & table formatter |
| `statistics_cli` | Statistical analysis & metrics engine |
| `subfinder_cli` | Subdomain discovery & DNS enumeration tool |
| `task_manager_cli` | Terminal task checklist & productivity manager |
| `terminal_recorder_studio` | Terminal recording assistant & VHS tape generator |
| `text_editor_cli` | Zero-dependency console text viewer & editor |
| `tr_cli` | Character translation & transformation utility |
| `vault_backup_manager` | Encrypted backup & restore manager (AES-256) |
| `wget2_cli` | Fast HTTP file downloader with progress bar |
| `yt_dlp_cli` | Media download orchestrator & quality preset engine |

---

## 🧪 Running Tests & Building

```bash
# Run all unit tests
bun test

# Generate shell completions for zsh, bash, or fish
bun run bin/simplcli.ts completion zsh

# Compile any CLI tool to a standalone zero-dependency executable
bun run bin/simplcli.ts compile jwt_cli ./dist/jwt-bin
```

---

## 📄 License

MIT © [codecaine](LICENSE)

