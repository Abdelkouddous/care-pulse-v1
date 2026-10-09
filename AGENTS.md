# AGENTS.md — Universal Agent Instructions

This repository uses a **Model-Agnostic Declarative Agent Core**. All AI agents operating in this repository must load and strictly adhere to the unified rules defined in [`.agents/rules/`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/.agents/rules).

## 1. Single Source of Truth
Before proposing or executing code changes, read the relevant declarative rule sets:
- **Brand & Identity:** [`.agents/rules/00-vitalsoft-brand.md`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/.agents/rules/00-vitalsoft-brand.md)
- **Engineering Protocol & Limits:** [`.agents/rules/01-engineering-protocol.md`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/.agents/rules/01-engineering-protocol.md)
- **Full-Stack Architecture:** [`.agents/rules/02-architecture-stack.md`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/.agents/rules/02-architecture-stack.md)
- **Mobile Stack:** [`.agents/rules/03-flutter-mobile.md`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/.agents/rules/03-flutter-mobile.md)

## 2. Core Operational Constraints
1. **Response Budget:** Answer in under 200 words. Lead with the recommendation, then the reasoning.
2. **Jira WIP Limit:** Maintain a strict Work-In-Progress limit of maximum 2 active tickets.
3. **Paths & Links:** Always reference files using clickable `file://` markdown links. Never use `cd` commands.

## 3. Encapsulated Agent Adapters
Tool-specific configuration files are strictly isolated into their official dot-directories:
- Claude Code: [`.claude/CLAUDE.md`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/.claude/CLAUDE.md)
- Cursor: [`.cursor/rules/carepulse.mdc`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/.cursor/rules/carepulse.mdc)
- GitHub Copilot: [`.github/copilot-instructions.md`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/.github/copilot-instructions.md)
