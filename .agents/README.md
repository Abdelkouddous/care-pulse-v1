# Antigravity & Gemini Unified Agent Workspace

This directory is the single source of truth for all instructions, rules, and behavioral guidelines governing AI assistants (Gemini, Antigravity, and autonomous subagents) working in this repository.

## Directory Structure

```bash
.agents/  (symlinked to .gemini)
├── README.md                          # This index and setup guide
└── rules/                             # Automatically discovered & loaded rule sets
    ├── 00-vitalsoft-brand.md          # Finalized Vital Soft brand identity & palette
    ├── 01-engineering-protocol.md     # Engineering protocol, response budget, Jira limits
    └── 02-architecture-stack.md       # Full-stack rules (Next.js 14, Laravel, Algerian locale)
```

## How It Works

- **Discovery:** Antigravity and Gemini automatically discover `.agents/rules/*.md` and load them contextually into the agent's instructions.
- **Deduplication:** The engine resolves symlinks and ensures each rule is evaluated cleanly once per session.
- **Clean Root:** Preserves project root cleanliness without scattering loose `.md` files outside `docs/` and `.agents/`.
