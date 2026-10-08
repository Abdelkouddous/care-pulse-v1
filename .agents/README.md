# Universal Declarative Agent Core

This directory is the model-agnostic single source of truth for repository rules, constraints, and operational guidelines governing all AI agent runtimes (Antigravity/Gemini, Claude Code, Cursor, GitHub Copilot, Codex).

## Architecture

```bash
care-pulse-v1/
├── AGENTS.md                  # Universal standard agent entry point (only agent file at root)
├── .claude/
│   └── CLAUDE.md              # Encapsulated Claude Code adapter
├── .cursor/
│   └── rules/carepulse.mdc    # Encapsulated Cursor rules adapter
├── .github/
│   └── copilot-instructions.md# Encapsulated Copilot adapter
├── .agents/                   # Declarative Source of Truth
│   ├── README.md              # Core architecture documentation
│   └── rules/                 # Model-agnostic markdown rules
│       ├── 00-vitalsoft-brand.md
│       ├── 01-engineering-protocol.md
│       ├── 02-architecture-stack.md
│       ├── 03-flutter-mobile.md
│       └── 04-flutter-template.md
├── apps/
│   ├── web/                   # Next.js 14 frontend
│   ├── api/                   # Laravel 11 backend
│   └── mobile/                # Flutter mobile client
├── tools/                     # Scripts, screen assets, and local dev tools
└── archive/                   # Deprecated legacy codebases
```

## How It Works
1. **Zero Root Pollution:** All tool-specific agent files live in their respective dot-directories (`.claude/`, `.cursor/`, `.github/`).
2. **Zero Instruction Drift:** When updating architectural constraints or branding, edit only files in `rules/`.
3. **Thin Adapter Pattern:** Runtime adapters are minimal pointers directing agents to `.agents/rules/`.
