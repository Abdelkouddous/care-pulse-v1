# Agentic SDLC (A-SDLC) — 5 Specialized Agents

Based on Bhati (2026), *Agentic AI in the Software Development Lifecycle*, this repository organizes automated software development into a human-supervised multi-agent lifecycle coordinated by an Orchestrator:

```
[ Human Supervisor (Developer) ]
              │ (Intent / Approval Gates)
      [ Orchestrator ]
  ┌───────┬───────┼───────┬───────┐
  ▼       ▼       ▼       ▼       ▼
Req     Design   Code    Test    Deploy
Agent   Agent    Agent   Agent   Agent
```

## Agent Roles & Boundaries

1. **`req_agent` (Requirements & Intent Specification)**
   - Translates human intent into structured acceptance criteria and edge-case contracts.
   - Clarifies ambiguities before any code or architecture is touched.

2. **`design_agent` (Architecture & ADR Design)**
   - Designs schemas, DDD aggregates, API contracts, and evaluates trade-offs.
   - Proposes alternatives for human review.

3. **`code_agent` (Implementation & Coding)**
   - Executes approved plans file-by-file with clean code and strict domain boundaries (SRP).
   - Keeps changes minimal and focused.

4. **`test_agent` (Testing & QA Sandbox)**
   - Generates unit, integration, and feature test suites (Pest, PHPUnit, Jest).
   - Validates green runs in sandboxed environments.

5. **`deploy_agent` (Governance & CI/CD Deployment)**
   - Runs linters, type checks, build verifications (`npm run build`, `composer check`).
   - Prepares release candidates under mandatory human approval gates.
