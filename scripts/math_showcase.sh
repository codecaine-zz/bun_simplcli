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
echo -e "${BOLD}${YELLOW}=== Bun SimpleCLI Mathematics & Scientific Suite ===${RESET}\n"
sleep 1

# 1. Programmer Radix & Bitwise Engine
type_and_run "bun run bin/simplcli.ts calc 0xDEADBEEF" 0.8

# 2. Descriptive Statistics & Central Tendency
type_and_run "bun run bin/simplcli.ts statistics '12.5, 24.0, 38.5, 42.0, 56.5, 68.0, 75.5, 89.0, 95.0, 112.5'" 0.8

# 3. Kalker Scientific Math & Trigonometry
type_and_run "bun run bin/simplcli.ts kalker 'sin(pi / 4) * sqrt(144)'" 0.8

# 4. Kalker Calculus: Numerical Derivative d/dx
type_and_run "bun run bin/simplcli.ts kalker --diff 'x^3 + 2*x^2 - 5*x, x=3'" 0.8

# 5. Kalker Calculus: Definite Integral ∫ f(x) dx
type_and_run "bun run bin/simplcli.ts kalker --integral 'x^2 * sin(x), 0, 3.14159'" 0.8

# 6. Qalculate Algebraic Equation Solver
type_and_run "bun run bin/simplcli.ts qalc --solve '4*x + 16 = 64'" 0.8

# 7. Numbat Physical Dimensional Units
type_and_run "bun run bin/simplcli.ts numbat" 0.8

# 8. Terminal Unicode Distribution & Bar Chart
type_and_run "bun run bin/simplcli.ts graph -d '10,25,50,85,120,95,60,30,15' -t 'Gaussian Distribution'" 0.8

echo -e "${BOLD}${GREEN}✔ All Mathematics & Calculus demonstrations completed successfully!${RESET}"
sleep 1.5
