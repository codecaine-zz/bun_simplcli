# SimpleCLI for Bun API Reference

Complete developer guide and API documentation for `bun-simplcli`.

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

```typescript
import { sys } from 'bun-simplcli';

const cpuCount = sys.cpuCount();
const cpuLoad = sys.cpuLoad();
const ramTotal = sys.ramTotal();
const ramUsed = sys.ramUsed();
const uptime = sys.osUptime();
const localIp = sys.localIp();
const wifi = sys.wifiSsid();

// Desktop notifications & speech
sys.notify('Build Complete', 'All 49 CLI applications compiled successfully.');
sys.say('Build succeeded');

// Process management
const [output, exitCode] = sys.exec('git status');
const isPortOpen = await sys.checkPort('127.0.0.1', 8080);
const openPorts = await sys.portScan('127.0.0.1', 20, 100);
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


