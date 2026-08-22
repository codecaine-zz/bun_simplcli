# SimpleCLI Beginner Starter Templates

A collection of beginner-friendly, production-grade starter templates for building Command-Line Interfaces (CLIs) with **Bun** and **bun-simplcli**.

---

## 📂 Available Templates

| Template | File | Description | Primary Concepts |
| :--- | :--- | :--- | :--- |
| **01. Minimalist Flag Parser** | [`01_basic_flags.ts`](./01_basic_flags.ts) | Single-file utility with typed CLI flags and positional arguments | `addFlagString`, `addFlagInt`, `addFlagBool`, `parseCli`, `getPositionalArgs` |
| **02. Interactive Prompt Wizard** | [`02_interactive_wizard.ts`](./02_interactive_wizard.ts) | Interactive onboarding questionnaire with prompts, selects, and validation | `prompt`, `promptPassword`, `promptEmail`, `select`, `multiSelect`, `confirm` |
| **03. Multi-Command Suite** | [`03_subcommands_suite.ts`](./03_subcommands_suite.ts) | CLI suite with nested subcommands (`init`, `build`, `deploy`) and actions | `app.command()`, `cmd.action()`, subcommand flags, `app.run()` |
| **04. DevOps Task Pipeline** | [`04_task_pipeline.ts`](./04_task_pipeline.ts) | Multi-step build/release runner with spinners, progress bars, and gauges | `app.newPipeline()`, `pipeline.addStep()`, `app.progressBar()`, `app.gauge()` |
| **05. System Hardware Monitor** | [`05_system_monitor.ts`](./05_system_monitor.ts) | Real-time OS telemetry, hardware statistics, and port checking | `sys.cpuLoad()`, `sys.ramUsed()`, `sys.checkPort()`, `sys.notify()` |
| **06. Persistent Config Store** | [`06_config_manager.ts`](./06_config_manager.ts) | Zero-config persistent user settings stored in `~/.config/<app>/` | `app.config.get()`, `app.config.set()`, `app.config.delete()`, `app.config.clear()` |
| **07. Data & SLA Reporter** | [`07_data_reporter.ts`](./07_data_reporter.ts) | Data analytics with formatted tables, sparkline charts, and stats | `app.table()`, `app.sparkline()`, `stdlib.mean()`, `stdlib.median()` |

---

## 🚀 How to Run the Templates

You can run any template directly using `bun run`:

```bash
# 1. Flag & Argument Parsing
bun run templates/01_basic_flags.ts --help
bun run templates/01_basic_flags.ts --env production --port 8080 --verbose src/file1.ts src/file2.ts

# 2. Interactive Wizard (Interactive Prompts)
bun run templates/02_interactive_wizard.ts

# 3. Multi-Command Suite
bun run templates/03_subcommands_suite.ts --help
bun run templates/03_subcommands_suite.ts build --minify --target bun
bun run templates/03_subcommands_suite.ts deploy --env production

# 4. DevOps Automation Pipeline
bun run templates/04_task_pipeline.ts

# 5. System Telemetry & Hardware Monitor
bun run templates/05_system_monitor.ts

# 6. Persistent Settings & Config Store
bun run templates/06_config_manager.ts --set user.name="Alice"
bun run templates/06_config_manager.ts --get user.name
bun run templates/06_config_manager.ts

# 7. Data Processing & Terminal Table Reporter
bun run templates/07_data_reporter.ts
bun run templates/07_data_reporter.ts --format json
```
