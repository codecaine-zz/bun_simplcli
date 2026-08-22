# SimpleCLI for Bun API Reference & Beginner Templates

Complete developer guide, beginner templates, and API documentation for `bun-simplcli`.

---

## 📑 Table of Contents

- [Beginner Starter Templates](#beginner-starter-templates)
  - [Template 1: Minimalist Flag & Argument Parser](#template-1-minimalist-flag--argument-parser)
  - [Template 2: Interactive Prompt & Survey Wizard](#template-2-interactive-prompt--survey-wizard)
  - [Template 3: Multi-Command Suite (Subcommands & Actions)](#template-3-multi-command-suite-subcommands--actions)
  - [Template 4: DevOps & Automation Task Pipeline](#template-4-devops--automation-task-pipeline)
  - [Template 5: System Telemetry & Hardware Monitor](#template-5-system-telemetry--hardware-monitor)
  - [Template 6: Zero-Config Persistent Settings Store](#template-6-zero-config-persistent-settings-store)
  - [Template 7: Data Processing & Formatted Table Reporting](#template-7-data-processing--formatted-table-reporting)
- [API Reference](#api-reference)
  - [1. Application Lifecycle & Setup](#1-application-lifecycle--setup)
  - [2. CLI Flags & Argument Parsing](#2-cli-flags--argument-parsing)
  - [3. Console UI & RAD Components](#3-console-ui--rad-components)
  - [4. Interactive Prompts & Menus](#4-interactive-prompts--menus)
  - [5. Multi-Step Task Pipeline](#5-multi-step-task-pipeline)
  - [6. Hardware Telemetry & System Utilities (`sys`)](#6-hardware-telemetry--system-utilities-sys)
  - [7. Extended Standard Library (`stdlib`)](#7-extended-standard-library-stdlib)
  - [8. Subcommand Routing & Action Handlers](#8-subcommand-routing--action-handlers)
  - [9. Zero-Config Persistent Storage (`app.config`)](#9-zero-config-persistent-storage-appconfig)
  - [10. Interactive File Explorer Picker](#10-interactive-file-explorer-picker)
  - [11. Shell Auto-Completion Generator](#11-shell-auto-completion-generator)
  - [12. Typo Suggestions ("Did You Mean?")](#12-typo-suggestions-did-you-mean)
  - [13. Documentation Generator & Standalone Binary Compilation](#13-documentation-generator--standalone-binary-compilation)
  - [14. Native Namespaced Redis Multi-Tenant Client](#14-native-namespaced-redis-multi-tenant-client)

---

# Beginner Starter Templates

These ready-to-run starter templates cover the most common CLI architectural patterns. All templates are available in the [`templates/`](./templates/) folder and can be run directly with Bun.

---

### Template 1: Minimalist Flag & Argument Parser

**Best for**: Single-purpose scripts, converters, file processors, and utilities that take options and positional arguments.

```typescript
#!/usr/bin/env bun
import { SimpleCLI } from 'bun-simplcli';

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

app.println(app.cyan('🌐 Target Port:'), `${port}`);
app.println(app.cyan('🔍 Verbose Logging:'), isVerbose ? app.green('ENABLED') : app.dim('DISABLED'));
app.println(app.cyan('🛡️ Dry Run Mode:'), isDryRun ? app.yellow('YES') : 'NO');

if (exclusions.length > 0) {
  app.println(app.cyan('🚫 Excluded patterns:'), exclusions.join(', '));
}

if (files.length === 0) {
  app.println(app.yellow('\n⚠ No input files provided. Pass files as positional arguments:'));
  app.println(app.dim('  bun run my-cli.ts src/file1.txt src/file2.txt'));
} else {
  app.println(app.green(`\n✔ Processing ${files.length} file(s):`));
  files.forEach((file, index) => {
    app.println(`  ${app.dim(`${index + 1}.`)} ${file}`);
  });
}
```

**Running the template:**
```bash
bun run templates/01_basic_flags.ts --help
bun run templates/01_basic_flags.ts --env production --port 8080 --verbose src/file1.txt src/file2.txt
```

---

### Template 2: Interactive Prompt & Survey Wizard

**Best for**: Interactive onboarding, project initializers (`create-*`), configuration wizards, and questionnaires.

```typescript
#!/usr/bin/env bun
import { SimpleCLI } from 'bun-simplcli';

const app = SimpleCLI.newApp('project-init-wizard', '1.0.0')
  .setDescription('Interactive project setup and configuration wizard');

async function main() {
  app.banner('Project Setup Wizard', 'Interactive Onboarding & Configuration');

  // 1. Text input with default fallback
  const projectName = await app.prompt('Enter project name:', 'my-awesome-app');

  // 2. Single selection dropdown
  const framework = await app.select('Choose frontend framework:', [
    'React + Vite',
    'Vue.js',
    'SvelteKit',
    'SolidJS',
    'Vanilla TypeScript',
  ]);

  // 3. Multi-selection menu (Space to toggle, Enter to confirm)
  const features = await app.multiSelect('Select additional plugins / integrations:', [
    'Tailwind CSS',
    'ESLint + Prettier',
    'Redis Cache Client',
    'GitHub Actions CI/CD',
    'Docker Compose',
  ]);

  // 4. Validated Email prompt
  const adminEmail = await app.promptEmail('Enter primary contact/admin email:', 'admin@example.com');

  // 5. Constrained Numeric prompt (prompt, default, min, max)
  const port = await app.promptNumber('Development server port:', 3000, 1024, 65535);

  // 6. Masked Password / Token prompt
  const apiKey = await app.promptPassword('Enter secret API access key (optional, hidden):');

  // 7. Binary Confirmation prompt
  const confirmed = await app.confirm('Initialize project with these settings?', true);

  if (!confirmed) {
    app.println(app.yellow('\n⚠ Setup cancelled by user.'));
    process.exit(0);
  }

  // 8. Output configuration summary panel
  app.println('\n' + app.green('✔ Project configuration confirmed!'));
  
  app.printKv({
    'Project Name': projectName,
    'Framework': framework,
    'Features': features.length > 0 ? features.join(', ') : 'None',
    'Admin Email': adminEmail,
    'Port': `${port}`,
    'API Key': apiKey ? '••••••••••••' : '(Not configured)',
  });

  app.panel(
    'Next Steps',
    `1. cd ${projectName}\n2. bun install\n3. bun run dev --port ${port}`
  );
}

main().catch(console.error);
```

**Running the template:**
```bash
bun run templates/02_interactive_wizard.ts
```

---

### Template 3: Multi-Command Suite (Subcommands & Actions)

**Best for**: Complex CLI suites with multiple tools or actions (e.g. `docker`, `git`, `kubectl`, `npm`).

```typescript
#!/usr/bin/env bun
import { SimpleCLI } from 'bun-simplcli';

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
```

**Running the template:**
```bash
bun run templates/03_subcommands_suite.ts --help
bun run templates/03_subcommands_suite.ts init --template bun my-service
bun run templates/03_subcommands_suite.ts build --minify --target bun
bun run templates/03_subcommands_suite.ts deploy --env production --force
```

---

### Template 4: DevOps & Automation Task Pipeline

**Best for**: CI/CD scripts, automated build jobs, database migrations, and release pilots.

```typescript
#!/usr/bin/env bun
import { SimpleCLI } from 'bun-simplcli';

const app = SimpleCLI.newApp('release-pilot', '1.0.0')
  .setDescription('Automated release and verification workflow');

async function main() {
  app.banner('Release Pilot Pipeline', 'Production Release v1.0.0');

  // 1. Step Indicator
  app.step(1, 'Validating environment & dependencies');
  await app.spinner('Checking Node & Bun runtime compatibility...', 600);
  app.println(app.green('  ✓ Runtime checks passed (Bun v' + Bun.version + ')'));

  // 2. Sequential Automated Task Pipeline
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

main().catch(console.error);
```

**Running the template:**
```bash
bun run templates/04_task_pipeline.ts
```

---

### Template 5: System Telemetry & Hardware Monitor

**Best for**: Health checkers, system info dashboards, diagnostic tools, and server monitors.

```typescript
#!/usr/bin/env bun
import { SimpleCLI, sys, stdlib } from 'bun-simplcli';

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

  // 5. Desktop Notification
  try {
    sys.notify('SysMon Complete', `Telemetry collected successfully for ${hostname}`);
  } catch {}
}

main().catch(console.error);
```

**Running the template:**
```bash
bun run templates/05_system_monitor.ts
```

---

### Template 6: Zero-Config Persistent Settings Store

**Best for**: Managing user preferences, storing API keys/tokens, default environments, and state across CLI runs without manual file handling.

```typescript
#!/usr/bin/env bun
import { SimpleCLI } from 'bun-simplcli';

const app = SimpleCLI.newApp('my-settings-cli', '1.0.0')
  .setDescription('Manage persistent configuration, API credentials, and preferences');

app.addFlagString('get', 'g', '', 'Get configuration value by key');
app.addFlagString('set', 's', '', 'Set configuration key=value');
app.addFlagString('delete', 'd', '', 'Delete configuration key');
app.addFlagBool('clear', 'C', false, 'Clear all stored configuration');

if (!app.parseCli()) {
  process.exit(0);
}

const getKey = app.getFlagString('get');
const setPair = app.getFlagString('set');
const deleteKey = app.getFlagString('delete');
const isClear = app.getFlagBool('clear');

app.banner('Configuration Manager', `Store: ~/.config/my-settings-cli/config.json`);

if (isClear) {
  app.config.clear();
  app.println(app.green('✔ All configuration cleared successfully.'));
  process.exit(0);
}

if (setPair) {
  const [key, ...rest] = setPair.split('=');
  const value = rest.join('=');
  if (!key || value === undefined) {
    app.println(app.red('✖ Invalid format. Use: --set key=value'));
    process.exit(1);
  }
  app.config.set(key.trim(), value.trim());
  app.println(app.green(`✔ Saved config "${key.trim()}" = "${value.trim()}"`));
  process.exit(0);
}

if (deleteKey) {
  if (app.config.has(deleteKey)) {
    app.config.delete(deleteKey);
    app.println(app.green(`✔ Deleted config key "${deleteKey}"`));
  } else {
    app.println(app.yellow(`⚠ Key "${deleteKey}" does not exist in config.`));
  }
  process.exit(0);
}

if (getKey) {
  const value = app.config.get(getKey);
  if (value !== undefined) {
    app.println(app.cyan(`Key "${getKey}":`), typeof value === 'object' ? JSON.stringify(value, null, 2) : `${value}`);
  } else {
    app.println(app.yellow(`⚠ Key "${getKey}" not found.`));
  }
  process.exit(0);
}

// Default: Display all current stored configuration
const allConfig = app.config.all();
const keys = Object.keys(allConfig);

if (keys.length === 0) {
  app.println(app.yellow('No stored settings found. Try adding some:'));
  app.println(app.dim('  bun run templates/06_config_manager.ts --set endpoint=https://api.example.com'));
  app.println(app.dim('  bun run templates/06_config_manager.ts --set user.email=dev@example.com'));
} else {
  app.println(app.bold('Current Stored Configuration:\n'));
  app.printKv(allConfig as Record<string, string>);
}
```

**Running the template:**
```bash
bun run templates/06_config_manager.ts --set user.name="Alice"
bun run templates/06_config_manager.ts --get user.name
bun run templates/06_config_manager.ts
```

---

### Template 7: Data Processing & Formatted Table Reporting

**Best for**: Log analyzers, API benchmarking, financial reports, and data visualization tools.

```typescript
#!/usr/bin/env bun
import { SimpleCLI, stdlib } from 'bun-simplcli';

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

  // Calculate summary statistics
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
```

**Running the template:**
```bash
bun run templates/07_data_reporter.ts
bun run templates/07_data_reporter.ts --format json
bun run templates/07_data_reporter.ts --format csv
```

---

# API Reference

---

## 1. Application Lifecycle & Setup

```typescript
import { SimpleCLI, newApp, initApp } from 'bun-simplcli';

// Initialize with app name & version
const app = SimpleCLI.newApp('Sentinel', '2.0.0')
  .setDescription('Production endpoint guardian & telemetry reporter')
  .setAuthor('DevOps Core Team')
  .setDebug(true)
  .setNoColor(false)
  .setSilent(false)
  .setLogLevel('info')
  .setLogFile('/tmp/sentinel.log');
```

---

## 2. CLI Flags & Argument Parsing

Define typed CLI flags with long names, short aliases, default values, and help descriptions:

```typescript
app.addFlagString('config', 'c', 'app.config.json', 'Path to JSON configuration');
app.addFlagInt('port', 'p', 5432, 'Target database port');
app.addFlagFloat('timeout', 't', 30.0, 'Network timeout in seconds');
app.addFlagBool('dry-run', 'd', false, 'Simulate execution without modifying state');
app.addFlagArray('tag', 'T', [], 'Target deployment tags');

if (!app.parseCli()) process.exit(0);

const configFile = app.getFlagString('config');
const dbPort = app.getFlagInt('port');
const isDryRun = app.getFlagBool('dry-run');
const tags = app.getFlagArray('tag');
const extraArgs = app.getPositionalArgs();
```

---

## 3. Console UI & RAD Components

### Terminal ANSI & TrueColor Styling

```typescript
app.println(app.bold('Bold headline text'));
app.println(app.dim('Muted debug commentary'));
app.println(app.green('✓ All 48 tests passed successfully'));
app.println(app.cyan('ℹ Connecting to database cluster...'));
app.println(app.yellow('⚠ High disk usage detected'));
app.println(app.red('✖ Fatal connection drop'));
app.println(app.rgb(255, 128, 0, '24-bit TrueColor orange text'));
app.println(app.hex('#FF0077', '24-bit Hex pink text'));
```

### Steps, Dividers, Banners & Panels

```typescript
app.step(1, 'Compiling Native Binaries');
app.divider('─', 60);
app.banner('Sentinel Infrastructure Pilot', 'Production Node 04 - us-east-1');
app.panel('Cluster Health', 'All 12 nodes reporting healthy heartbeat (RTT < 4ms).');
```

### Formatted Tables & Key-Value Status

```typescript
app.printKv({
  'Host Name': 'srv-prod-api-01',
  'IP Address': '10.0.4.18',
  'Architecture': 'aarch64 (Apple Silicon)',
  'Uptime': '14 days, 6 hours',
});

app.table(
  ['Endpoint', 'Protocol', 'Latency', 'Status'],
  [
    ['https://api.internal/v1', 'HTTP/2', '12.4 ms', '200 OK'],
    ['https://auth.internal', 'HTTP/2', '8.1 ms', '200 OK'],
    ['postgres://10.0.0.5:5432', 'TCP', '1.2 ms', 'CONNECTED'],
  ]
);
```

### Progress Bars, Spinners & Gauges

```typescript
// Progress bar
for (let i = 1; i <= 100; i++) {
  app.progressBar(i, 100, 'Migrating tables');
}

// Async animated spinner
await app.spinner('Synchronizing repository submodules...', 1500);

// Single-metric gauge with threshold badge
app.gauge('PostgreSQL Connection Pool', 48.0, 50.0, 'conns');
```

### Hierarchical Tree Visualizer

```typescript
import { TreeNode } from 'bun-simplcli';

const root = new TreeNode('production-cluster');
const db = root.addChild('postgres-db');
db.addChild('replica-01 (read-only)');
db.addChild('replica-02 (standby)');
root.addChild('redis-cache');

app.tree(root);
```

### Colorized Line Diff Viewer

```typescript
const oldConfig = 'port: 8080\nworkers: 4\nenv: staging';
const newConfig = 'port: 8080\nworkers: 8\nenv: production\ntls: true';

app.diff(oldConfig, newConfig);
```

---

## 4. Interactive Prompts & Menus

```typescript
// Plain text prompt
const username = await app.prompt('Enter admin username:', 'admin');

// Hidden / masked password prompt
const token = await app.promptPassword('Enter secret API access token:');

// Validated email & URL prompts
const email = await app.promptEmail('Enter alert recipient email:', 'dev@domain.com');
const url = await app.promptUrl('Enter webhook URL:', 'https://hooks.slack.com/...');

// Constrained numeric prompt
const threads = await app.promptNumber('Worker threads', 8, 1, 64);

// Confirmation prompt
const proceed = await app.confirm('Apply migrations to production?', false);

// Single selection menu (with arrow keys)
const env = await app.select('Target environment:', ['staging', 'production']);

// Multi-select menu (with space toggles)
const services = await app.multiSelect('Select services:', ['Postgres', 'Redis', 'Kafka']);

// Live fuzzy search selector
const branch = await app.fuzzySelect('Search branch:', ['main', 'feature/auth', 'fix/bug']);
```

---

## 5. Multi-Step Task Pipeline

```typescript
const pipeline = app.newPipeline('Production Release Pipeline');

pipeline.addStep('Clean temporary build artifacts', async () => true);
pipeline.addStep('Compile native binaries', async () => true);
pipeline.addStep('Run security vulnerability scan', async () => true);
pipeline.addStep('Deploy container image to registry', async () => true);

const success = await pipeline.run();
```

---

## 6. Hardware Telemetry & System Utilities (`sys`)

### Hardware Telemetry & Resource Probing

```typescript
import { sys } from 'bun-simplcli';

const cpuCount = sys.cpuCount();
const cpuLoad = sys.cpuLoad(); // [1m, 5m, 15m]
const ramTotal = sys.ramTotal();
const ramUsed = sys.ramUsed();
const ramFree = sys.ramFree();
const uptime = sys.osUptime();
const localIp = sys.localIp();
const wifi = sys.wifiSsid();
const hostname = sys.osHostname();

// Desktop notifications & speech synthesis
sys.notify('Build Complete', 'All 54 CLI applications compiled successfully.');
sys.say('Build succeeded');

// Process management & execution
const [output, exitCode] = sys.exec('git status');
const isPortOpen = await sys.checkPort('127.0.0.1', 8080);
const openPorts = await sys.portScan('127.0.0.1', 20, 100);
```

### Native High-Speed File I/O (Bun.file & Bun.write)

Zero-boilerplate, asynchronous & synchronous file operations powered by Bun's native C++ engine:

```typescript
// Fast asynchronous reads (UTF-8, JSON, Raw Bytes)
const text = await sys.readText('./config.yaml');
const config = await sys.readJson<{ port: number }>('./config.json', { port: 3000 });
const bytes = await sys.readBytes('./binary.dat');

// Fast asynchronous writes & JSON serialization
await sys.write('./output.txt', 'Hello Bun Native I/O');
await sys.writeJson('./settings.json', { theme: 'dark', retries: 3 });
await sys.append('./activity.log', '2026-08-22 User logged in\n');

// File metadata & inspection
const exists = await sys.fileExists('./bundle.js');
const size = sys.fileSize('./bundle.js'); // in bytes
const mime = sys.fileMime('./data.csv');   // 'text/csv'
sys.ensureDir('./dist/assets');            // Recursive mkdir
sys.deleteFile('./temp.log');             // Safe unlink
```

### Binary Resolution & Environment Probing (`Bun.which` & `Bun.env`)

```typescript
// Check and locate external binaries in PATH
const ffmpegPath = sys.which('ffmpeg'); // e.g. '/opt/homebrew/bin/ffmpeg' or null
const hasDocker = sys.hasBinary('docker'); // boolean

// Typed environment variables
const port = sys.getEnv('PORT', '3000');
sys.setEnv('DEBUG', '1');
const secret = sys.requireEnv('DATABASE_URL'); // throws if missing
```

### High-Precision Time & Benchmarking

```typescript
// High-precision nanosecond timer & async sleep
const startNs = sys.nanoseconds();
await sys.sleep(100); // 100ms non-blocking sleep via Bun.sleep

// Benchmark synchronous & asynchronous execution
const syncBench = sys.measure(() => {
  return Array.from({ length: 10000 }).map((_, i) => i * 2);
});
console.log(`Computed in ${syncBench.durationMs} ms (${syncBench.durationNs} ns)`);

const asyncBench = await sys.measureAsync(async () => {
  return await fetch('https://api.github.com');
});
console.log(`HTTP request completed in ${asyncBench.durationMs} ms`);
```

### Fast Checksums, Hashing & Native Compression

```typescript
// Native 64-bit non-cryptographic fast hashing & checksums
const fastHash = sys.fastHash('payload_data'); // Wyhash / xxHash
const crc = sys.crc32('payload_data');
const adler = sys.adler32('payload_data');

// High-speed native Gzip & Deflate compression
const compressed = sys.gzip('Large text or log stream');
const decompressed = sys.gunzip(compressed);

const deflated = sys.deflate('Payload bytes');
const inflated = sys.inflate(deflated);
```

### Instant Micro HTTP Server & Static File Server (`Bun.serve`)

Spin up lightweight servers directly from CLI scripts:

```typescript
// 1. Instant Static File Web Server
const server = sys.serveStatic('./public', 8080);
console.log('Serving ./public on http://localhost:8080');

// 2. Custom Micro REST / Health Server
sys.serve({
  port: 4000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/health') return Response.json({ status: 'ok' });
    return new Response('SimpleCLI Micro Server');
  },
});
```

### App-Instance Helpers (`app.*`)

All these system utilities are also accessible directly on your `app` instance:

```typescript
const app = SimpleCLI.newApp('myapp');

const hasGit = app.hasBinary('git');
const gitPath = app.which('git');
await app.writeFile('./output.json', JSON.stringify({ ok: true }));
const data = await app.readJson('./output.json');
await app.sleep(500);

const bench = await app.measureAsync(async () => {
  // run task...
});
```

---

## 7. Extended Standard Library (`stdlib`)

```typescript
import { stdlib, Stack, Queue, RingBuffer, LRUCache } from 'bun-simplcli';

// High-speed Cryptography
const sha256 = stdlib.sha256('data');
const cipher = stdlib.aesEncrypt('Secret', 'my-key');
const plain = stdlib.aesDecrypt(cipher, 'my-key');
const hash = await stdlib.bcryptHash('Password123');
const verified = await stdlib.bcryptVerify('Password123', hash);
const id = stdlib.uuidV7();

// Statistics
const mean = stdlib.mean([10, 20, 30, 40]);
const median = stdlib.median([10, 20, 30, 40]);
const stddev = stdlib.stddev([10, 20, 30, 40]);

// String Metrics
const dist = stdlib.levenshteinDistance('kitten', 'sitting');
const sim = stdlib.jaroWinklerSimilarity('martha', 'marhta');
const slug = stdlib.slugify('Hello World 2026!');
```

---

## 8. Subcommand Routing & Action Handlers

Organize complex multi-command CLI utilities with isolated flags, descriptions, and action callbacks:

```typescript
const app = SimpleCLI.newApp('cloudctl', '1.0.0')
  .setDescription('Cloud Infrastructure Management Suite');

app.command('deploy', (sub) => {
  sub.setDescription('Deploy service container to cluster')
    .addFlagString('env', 'e', 'staging', 'Target deployment environment')
    .addFlagBool('force', 'f', false, 'Force replace running pod')
    .action(async (flags, args) => {
      console.log(`Deploying to ${flags.env}... target: ${args[0]}`);
    });
});

app.command('rollback', (sub) => {
  sub.setDescription('Rollback service to previous revision')
    .addFlagInt('revision', 'r', 1, 'Target revision ID')
    .action(async (flags) => {
      console.log(`Rolling back to revision ${flags.revision}...`);
    });
});

await app.run();
```

---

## 9. Zero-Config Persistent Storage (`app.config`)

Store auth tokens, user preferences, and state automatically in standard OS config paths (`~/.config/<app>/config.json`):

```typescript
// Nested key-value manipulation with automatic JSON persistence
app.config.set('auth.token', 'eyJhGciOi...');
app.config.set('theme.dark', true);

const token = app.config.get('auth.token');
const isDark = app.config.get('theme.dark', false);

if (app.config.has('auth.token')) {
  // Config exists
}

app.config.delete('auth.token');
app.config.clear();
```

---

## 10. Interactive File Explorer Picker

Interactive directory and file explorer navigation right inside the terminal:

```typescript
const selectedFile = await app.filePicker('Choose input data file:', {
  baseDir: './data',
  extensions: ['.json', '.csv'],
  mode: PathMode.FILE,
});
```

---

## 11. Shell Auto-Completion Generator

Generate tab auto-completion scripts for `bash`, `zsh`, and `fish` directly from your command and flag definitions:

```typescript
// Generate raw completion script
const zshScript = app.generateCompletions('zsh');
const bashScript = app.generateCompletions('bash');
const fishScript = app.generateCompletions('fish');

// Or invoke the built-in dispatcher completion
// simplcli completion zsh > ~/.zsh/completions/_simplcli
```

---

## 12. Typo Suggestions ("Did You Mean?")

SimpleCLI automatically detects mistyped subcommands and flags using Levenshtein distance:

```bash
$ simplcli doker
Unknown CLI application "doker".
💡 Did you mean "docker_cli"?
Run "simplcli --list" to view all available tools.
```

---

## 13. Documentation Generator & Standalone Binary Compilation

```typescript
// Generate Markdown Documentation
const markdownDocs = app.generateMarkdownDocs();

// Generate UNIX Roff Man Page
const manPage = app.generateManPage();

// Compile application to standalone single-file binary with Bun
await SimpleCLI.compileBinary('./bin/simplcli.ts', './dist/simplcli-bin');
```

---

## 14. Native Namespaced Redis Multi-Tenant Client

Isolate different applications, services, or tenants within a single Redis instance using zero-overhead key prefixing and automatic sub-namespacing powered by Bun's native `bun:redis` engine:

```typescript
import { NamespacedRedis, createRedisNamespace } from 'bun-simplcli';

// Initialize a namespaced client for an app or tenant
const authApp = createRedisNamespace('auth_service');
const analyticsApp = createRedisNamespace('analytics');

// 1. Key-Value & Typed JSON Operations
// Stored as 'auth_service:user:42' in Redis, but accessed cleanly as 'user:42'
await authApp.setJson('user:42', { id: 42, role: 'admin' }, { ex: 3600 });
const user = await authApp.getJson<{ id: number; role: string }>('user:42');

// 2. Sub-namespacing (Hierarchical namespaces)
const sessionStore = authApp.namespace('sessions'); // 'auth_service:sessions:...'
await sessionStore.set('session_abc', 'active', { ex: 1800 });

// 3. Hashes, Lists, Sets & Counters
await authApp.hset('profile:42', { name: 'Alex', loginCount: 1 });
await authApp.sadd('roles:admin', 'user:42', 'user:88');
await authApp.incr('metrics:login_attempts');

// 4. Distributed Locks (Mutex)
await authApp.withLock('migration_lock', async () => {
  // Execute critical section with automatic lock acquire and release
  console.log('Running safe migration...');
}, 5000);

// 5. Namespace Isolation & Safe Flush
// Only deletes keys starting with 'auth_service:', leaving all other apps safe!
const deleted = await authApp.flushNamespace();
```
