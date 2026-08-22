#!/usr/bin/env bash
set -e

# ANSI styling
BOLD="\033[1m"
CYAN="\033[36m"
GREEN="\033[32m"
YELLOW="\033[33m"
RESET="\033[0m"

type_and_run() {
    local cmd="$1"
    local delay="${2:-0.8}"
    echo -e "${GREEN}➜${RESET} ${BOLD}${CYAN}${cmd}${RESET}"
    sleep "$delay"
    eval "$cmd"
    echo ""
    sleep 1.2
}

if [ -n "$TERM" ] && [ "$TERM" != "dumb" ]; then
    clear || true
fi
echo -e "${BOLD}${YELLOW}=== Bun SimpleCLI Console & RAD Toolkit Suite Demo ===${RESET}\n"
sleep 1

# Demo 1: List all 49 available CLI tools
type_and_run "bun run bin/simplcli.ts --list" 0.8

# Demo 2: Programmer Calculator (Hex/Binary/Bitwise)
type_and_run "bun run bin/simplcli.ts calc 0xDEADBEEF" 0.8

# Demo 3: Statistical Metrics & Sparkline Distribution
type_and_run "bun run bin/simplcli.ts statistics '15.2, 28.7, 34.1, 49.8, 52.0, 68.4, 73.9, 88.1, 95.6, 110.2'" 0.8

# Demo 4: Terminal Graphs & Horizontal Bar Charts
type_and_run "bun run bin/simplcli.ts graph -d '12,28,45,72,98,85,62,38,19' -t 'Cluster Request Rate'" 0.8

# Demo 5: Cryptographic Studio & AES-256 Encryption
type_and_run "bun run bin/simplcli.ts crypto --algo sha256 --text 'Bun SimpleCLI High-Performance Toolkit'" 0.8
type_and_run "bun run bin/simplcli.ts crypto --key 'SecretVaultKey2026' --encrypt 'Zero-Dependency Bun CLI Framework'" 0.8

# Demo 6: Tabular Data Converter
type_and_run "bun run bin/simplcli.ts dataconvert --from csv --to json" 0.8

# Demo 7: Terminal Task Checklist
type_and_run "bun run bin/simplcli.ts task_manager" 0.8

echo -e "${BOLD}${GREEN}✔ All Bun SimpleCLI demonstrations completed successfully!${RESET}"
sleep 1.5
