#!/usr/bin/env bash
# ==============================================================================
# SimpleCLI: Homebrew & Subprocess Dependencies Installer
# ==============================================================================
# Installs Homebrew (if not present) and all external CLI dependencies
# used by SimpleCLI applications that rely on subprocess execution.
# ==============================================================================

set -eo pipefail

# ANSI color formatting
BOLD="\033[1m"
DIM="\033[2m"
CYAN="\033[36m"
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
MAGENTA="\033[35m"
BLUE="\033[34m"
RESET="\033[0m"

# Print banner
print_banner() {
    echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BOLD}${BLUE}║${RESET}   ${BOLD}${CYAN}SimpleCLI for Bun${RESET} - ${BOLD}Homebrew & Dependencies Setup${RESET}        ${BOLD}${BLUE}║${RESET}"
    echo -e "${BOLD}${BLUE}║${RESET}   ${DIM}Automated installer for CLI subprocess tools & utilities${RESET}   ${BOLD}${BLUE}║${RESET}"
    echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════════╝${RESET}\n"
}

# Formula definitions categorized
ESSENTIAL_PACKAGES=(
    "ripgrep:rg:Fast recursive search (rg_cli)"
    "fd:fd:Fast directory & file traversal (fd_cli)"
    "jq:jq:JSON query, syntax & filter (jq_cli)"
    "ffmpeg:ffmpeg:Media transcoding & VHS tapes (ffmpeg_cli)"
    "redis:redis-server:In-memory multi-tenant Redis (redis_cli)"
)

MEDIA_PACKAGES=(
    "imagemagick:magick:Batch image converter & resizer (imagemagick_cli)"
    "tesseract:tesseract:OCR text extractor (ocr_cli)"
    "yt-dlp:yt-dlp:Media download orchestrator (yt_dlp_cli)"
    "exiftool:exiftool:EXIF metadata inspector & stripper (exif_cli)"
    "id3v2:id3v2:Audio ID3 metadata tag inspector (audiotag_cli)"
)

UTILITY_PACKAGES=(
    "pandoc:pandoc:Universal document converter (pandoc_cli)"
    "ouch:ouch:Universal compression & decompression (ouch_cli)"
    "wget:wget:HTTP file downloader (wget2_cli)"
    "gawk:gawk:Pattern scanning & text engine (gawk_cli)"
    "sd:sd:Fast intuitive search & replace (sd_cli)"
    "sqlite:sqlite3:SQLite database engine (sqlite_cli)"
)

SECURITY_PACKAGES=(
    "nmap:nmap:Network discovery & port scanner (nmap_cli)"
    "subfinder:subfinder:Fast subdomain discovery tool (subfinder_cli)"
)

MATH_PACKAGES=(
    "libqalculate:qalc:Advanced algebraic equation solver (qalc_cli)"
    "numbat:numbat:Dimensional unit & physics calculator (numbat_cli)"
    "kalker:kalker:Scientific & calculus calculator (kalker_cli)"
)

VHS_PACKAGES=(
    "charmbracelet/tap/vhs:vhs:Terminal GIF recording studio (terminal_recorder_studio)"
    "ttyd:ttyd:Terminal sharing over web / VHS recording engine"
)

# Usage helper
show_help() {
    print_banner
    echo -e "${BOLD}USAGE:${RESET}"
    echo -e "  ./scripts/install_dependencies.sh [OPTIONS]\n"
    echo -e "${BOLD}OPTIONS:${RESET}"
    echo -e "  ${CYAN}--all${RESET}            Install all CLI tools for all 54 applications (Recommended)"
    echo -e "  ${CYAN}--essential${RESET}      Install only core essential tools (rg, fd, jq, ffmpeg, redis)"
    echo -e "  ${CYAN}--media${RESET}          Install media processing tools (ffmpeg, yt-dlp, imagemagick, tesseract, exiftool, id3v2)"
    echo -e "  ${CYAN}--math${RESET}           Install scientific math tools (libqalculate, numbat, kalker)"
    echo -e "  ${CYAN}--security${RESET}       Install network & security tools (nmap, subfinder)"
    echo -e "  ${CYAN}--vhs${RESET}            Install Charm VHS & ttyd for recording terminal demos"
    echo -e "  ${CYAN}--check${RESET}          Audit and display status of all tools without installing"
    echo -e "  ${CYAN}--help, -h${RESET}       Show this help documentation\n"
    echo -e "${BOLD}EXAMPLES:${RESET}"
    echo -e "  ${DIM}# Audit existing tools:${RESET}"
    echo -e "  ./scripts/install_dependencies.sh --check"
    echo -e "  ${DIM}# Install full suite for all tools:${RESET}"
    echo -e "  ./scripts/install_dependencies.sh --all\n"
}

# Ensure Homebrew is in current session PATH
setup_brew_path() {
    if command -v brew >/dev/null 2>&1; then
        return 0
    fi

    # Check standard Homebrew locations
    if [ -x "/opt/homebrew/bin/brew" ]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [ -x "/usr/local/bin/brew" ]; then
        eval "$(/usr/local/bin/brew shellenv)"
    elif [ -x "/home/linuxbrew/.linuxbrew/bin/brew" ]; then
        eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
    fi
}

# Install Homebrew if missing
ensure_homebrew() {
    setup_brew_path

    if command -v brew >/dev/null 2>&1; then
        local brew_ver
        brew_ver=$(brew --version | head -n 1)
        echo -e "${GREEN}✔${RESET} ${BOLD}Homebrew is installed:${RESET} ${DIM}${brew_ver}${RESET}"
        return 0
    fi

    echo -e "${YELLOW}➜${RESET} ${BOLD}Homebrew is not detected on your system.${RESET}"
    echo -e "  Homebrew is the package manager required to install CLI binaries for subprocesses."

    if [ "$CHECK_ONLY" = true ]; then
        echo -e "${RED}✖ Homebrew is missing. Run without --check to install.${RESET}"
        return 1
    fi

    read -rp "  Would you like to install Homebrew now? [Y/n] " confirm
    confirm=${confirm:-Y}
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo -e "${RED}✖ Homebrew installation cancelled. Aborting.${RESET}"
        exit 1
    fi

    echo -e "\n${CYAN}➜ Installing Homebrew from official repository...${RESET}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Re-setup path after installation
    setup_brew_path

    if command -v brew >/dev/null 2>&1; then
        echo -e "${GREEN}✔ Successfully installed Homebrew!${RESET}\n"
    else
        echo -e "${RED}✖ Homebrew installed, but not found in PATH. Please restart your shell or add to ~/.zshrc / ~/.bashrc${RESET}"
        exit 1
    fi
}

# Check single binary
is_installed() {
    local bin="$1"
    command -v "$bin" >/dev/null 2>&1
}

# Audit package list and return status
audit_packages() {
    local category_name="$1"
    shift
    local packages=("$@")

    echo -e "\n${BOLD}${BLUE}📦 ${category_name}${RESET}"
    printf "${BOLD}%-26s %-12s %-12s %-32s${RESET}\n" "Package" "Binary" "Status" "CLI App Usage"
    echo -e "${DIM}────────────────────────────────────────────────────────────────────────────────────────${RESET}"

    for entry in "${packages[@]}"; do
        IFS=":" read -r pkg bin desc <<< "$entry"
        if is_installed "$bin"; then
            printf "%-26s %-12s ${GREEN}%-12s${RESET} ${DIM}%-32s${RESET}\n" "$pkg" "$bin" "✔ Installed" "$desc"
        else
            printf "%-26s %-12s ${YELLOW}%-12s${RESET} ${DIM}%-32s${RESET}\n" "$pkg" "$bin" "○ Missing" "$desc"
        fi
    done
}

# Install list of packages
install_package_list() {
    local category_name="$1"
    shift
    local packages=("$@")

    local to_install=()

    for entry in "${packages[@]}"; do
        IFS=":" read -r pkg bin desc <<< "$entry"
        if ! is_installed "$bin"; then
            to_install+=("$pkg")
        fi
    done

    if [ ${#to_install[@]} -eq 0 ]; then
        echo -e "${GREEN}✔${RESET} All packages in ${BOLD}${category_name}${RESET} are already installed."
        return 0
    fi

    echo -e "\n${CYAN}➜ Installing ${#to_install[@]} package(s) for ${category_name}...${RESET}"
    for pkg in "${to_install[@]}"; do
        echo -e "  ${BOLD}Installing ${pkg}...${RESET}"
        brew install "$pkg" || {
            echo -e "  ${YELLOW}⚠ Warning: Failed to install ${pkg}. Continuing with others...${RESET}"
        }
    done
}

# Main routing logic
MODE="essential"
CHECK_ONLY=false

if [ $# -eq 0 ]; then
    MODE="interactive"
fi

while [[ $# -gt 0 ]]; do
    case "$1" in
        --all)
            MODE="all"
            shift
            ;;
        --essential)
            MODE="essential"
            shift
            ;;
        --media)
            MODE="media"
            shift
            ;;
        --math)
            MODE="math"
            shift
            ;;
        --security)
            MODE="security"
            shift
            ;;
        --vhs)
            MODE="vhs"
            shift
            ;;
        --check)
            CHECK_ONLY=true
            MODE="check"
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${RESET}"
            show_help
            exit 1
            ;;
    esac
done

print_banner
setup_brew_path

if [ "$MODE" = "check" ] || [ "$CHECK_ONLY" = true ]; then
    ensure_homebrew || true
    audit_packages "Essential & Core Tools" "${ESSENTIAL_PACKAGES[@]}"
    audit_packages "Media & Transcoding" "${MEDIA_PACKAGES[@]}"
    audit_packages "Utilities & Documents" "${UTILITY_PACKAGES[@]}"
    audit_packages "Security & Networking" "${SECURITY_PACKAGES[@]}"
    audit_packages "Math & Science" "${MATH_PACKAGES[@]}"
    audit_packages "Terminal Recording & VHS" "${VHS_PACKAGES[@]}"
    echo -e "\n${CYAN}Tip:${RESET} Run ${BOLD}./scripts/install_dependencies.sh --all${RESET} to install all missing dependencies.\n"
    exit 0
fi

ensure_homebrew

if [ "$MODE" = "interactive" ]; then
    echo -e "${BOLD}Select installation profile:${RESET}"
    echo -e "  ${BOLD}1)${RESET} ${GREEN}All Tools (Recommended)${RESET} - Full suite for all 54 CLI apps + VHS"
    echo -e "  ${BOLD}2)${RESET} ${CYAN}Essential Core${RESET} - ripgrep, fd, jq, ffmpeg, redis"
    echo -e "  ${BOLD}3)${RESET} ${MAGENTA}Media & Recording${RESET} - ffmpeg, imagemagick, yt-dlp, vhs, tesseract"
    echo -e "  ${BOLD}4)${RESET} ${YELLOW}Math & Science${RESET} - qalc, numbat, kalker"
    echo -e "  ${BOLD}5)${RESET} ${BLUE}Audit & Check Only${RESET} - Inspect status without installing\n"
    read -rp "Enter choice [1-5, default: 1]: " choice
    choice=${choice:-1}
    case "$choice" in
        1) MODE="all" ;;
        2) MODE="essential" ;;
        3) MODE="media_vhs" ;;
        4) MODE="math" ;;
        5)
            CHECK_ONLY=true
            MODE="check"
            audit_packages "Essential & Core Tools" "${ESSENTIAL_PACKAGES[@]}"
            audit_packages "Media & Transcoding" "${MEDIA_PACKAGES[@]}"
            audit_packages "Utilities & Documents" "${UTILITY_PACKAGES[@]}"
            audit_packages "Security & Networking" "${SECURITY_PACKAGES[@]}"
            audit_packages "Math & Science" "${MATH_PACKAGES[@]}"
            audit_packages "Terminal Recording & VHS" "${VHS_PACKAGES[@]}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice, defaulting to all tools.${RESET}"
            MODE="all"
            ;;
    esac
fi

echo -e "\n${BOLD}${GREEN}Starting installation for profile: ${MODE}${RESET}\n"

case "$MODE" in
    all)
        install_package_list "Essential & Core Tools" "${ESSENTIAL_PACKAGES[@]}"
        install_package_list "Media & Transcoding" "${MEDIA_PACKAGES[@]}"
        install_package_list "Utilities & Documents" "${UTILITY_PACKAGES[@]}"
        install_package_list "Security & Networking" "${SECURITY_PACKAGES[@]}"
        install_package_list "Math & Science" "${MATH_PACKAGES[@]}"
        install_package_list "Terminal Recording & VHS" "${VHS_PACKAGES[@]}"
        ;;
    essential)
        install_package_list "Essential & Core Tools" "${ESSENTIAL_PACKAGES[@]}"
        ;;
    media)
        install_package_list "Media & Transcoding" "${MEDIA_PACKAGES[@]}"
        ;;
    media_vhs)
        install_package_list "Media & Transcoding" "${MEDIA_PACKAGES[@]}"
        install_package_list "Terminal Recording & VHS" "${VHS_PACKAGES[@]}"
        ;;
    math)
        install_package_list "Math & Science" "${MATH_PACKAGES[@]}"
        ;;
    security)
        install_package_list "Security & Networking" "${SECURITY_PACKAGES[@]}"
        ;;
    vhs)
        install_package_list "Terminal Recording & VHS" "${VHS_PACKAGES[@]}"
        ;;
esac

echo -e "\n${BOLD}${BLUE}=== Final Dependency Verification ===${RESET}"
audit_packages "Essential & Core Tools" "${ESSENTIAL_PACKAGES[@]}"
if [ "$MODE" = "all" ] || [ "$MODE" = "media" ] || [ "$MODE" = "media_vhs" ]; then
    audit_packages "Media & Transcoding" "${MEDIA_PACKAGES[@]}"
fi
if [ "$MODE" = "all" ]; then
    audit_packages "Utilities & Documents" "${UTILITY_PACKAGES[@]}"
    audit_packages "Security & Networking" "${SECURITY_PACKAGES[@]}"
fi
if [ "$MODE" = "all" ] || [ "$MODE" = "math" ]; then
    audit_packages "Math & Science" "${MATH_PACKAGES[@]}"
fi
if [ "$MODE" = "all" ] || [ "$MODE" = "vhs" ] || [ "$MODE" = "media_vhs" ]; then
    audit_packages "Terminal Recording & VHS" "${VHS_PACKAGES[@]}"
fi

echo -e "\n${BOLD}${GREEN}✨ Setup completed successfully! You can now run all SimpleCLI applications.${RESET}\n"
