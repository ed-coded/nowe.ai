# AI Development Instructions

## Overview
This document defines the engineering standards, architecture principles, coding conventions, security requirements, and operational guidelines for all development work in this project.
Enterprise Autonomous Agent Governance Specification.

Always follow Agents.md, ui-rules.md, and api-rules.md,architecture.md, database.md all found in the agent-guide directory.
Never bypass architectural constraints.
Always generate plans before implementation.

# 1. Purpose

This document defines the behavioral, architectural, operational,
and security constraints for all autonomous and semi-autonomous
AI agents operating within this repository.

This specification applies to:
- Google Antigravity
- Cursor Agents
- Claude Code
- Windsurf Cascade
- OpenAI Codex Agents
- CI/CD Automation Agents
- Internal orchestration subagents

The purpose is to ensure:
- Deterministic execution
- Safe automation
- Verifiable outputs
- Controlled permissions
- Stable system evolution
- Human-governed escalation

---

# 2. Core Agent Principles

All agents MUST operate under the following principles:

1. Deterministic execution
2. Explicit permission boundaries
3. Minimal side effects
4. Human-supervised escalation
5. Observable decision-making
6. Reversible modifications
7. Security-first behavior
8. Test-first implementation

---

# 3. Agent Hierarchy

## 3.1 Primary Orchestrator

The Primary Orchestrator Agent is responsible for:
- Task decomposition
- Dependency analysis
- Plan artifact generation
- Delegation to subagents
- Execution sequencing

The orchestrator MAY NOT:
- Self-approve permissions
- Override security constraints
- Disable verification pipelines

---

## 3.2 Specialized Subagents

### Architecture Agent
Responsibilities:
- Structural planning
- Interface contracts
- Dependency boundaries
- Modular decomposition

---

### Backend Agent
Responsibilities:
- API implementation
- Database interaction
- Service orchestration
- Authentication systems

---

### Frontend Agent
Responsibilities:
- UI rendering
- Accessibility compliance
- State management
- Client-side optimization
- Enforce premium "Quiet Luxury" design aesthetics (curated palettes, glassmorphism, smooth micro-animations)
- Avoid generic default UI components

---

### Security Agent
Responsibilities:
- Dependency auditing
- Vulnerability scanning
- Secret detection
- Boundary enforcement

The Security Agent has veto authority over merges.

---

### Verification Agent
Responsibilities:
- Static analysis
- Test execution
- Coverage validation
- Runtime inspection

---

### Infrastructure Agent
Responsibilities:
- CI/CD pipelines
- Docker orchestration
- Deployment configuration
- Environment validation

Infrastructure changes require explicit approval.

---

# 4. Mandatory Execution Workflow

Every task MUST follow this sequence.

---

## Phase 1 — Context Acquisition

Agents MAY:
- Read source files
- Inspect dependency graphs
- Analyze architecture
- Read documentation

Agents MAY NOT:
- Modify files
- Install dependencies
- Execute arbitrary shell commands

---

## Phase 2 — Plan Artifact Generation

Before modifying files, the agent MUST generate:

- Structural blueprint
- File modification map
- Dependency impact analysis
- Test strategy
- Rollback plan

---

## Required Planning Prompt

```txt id="9k0q7v"
Initialize structural blueprint for [SYSTEM_NAME].

System requirements:
- ES Modules
- Strong static typing
- 100% test coverage
- Strict dependency boundaries

Output:
- Folder structure
- Interface definitions
- Service boundaries
- Verification strategy

Do not alter files.
```

> [!NOTE]
> For bug fixes or minor modifications, the agent may skip the full structural blueprint and focus solely on the File Modification Map and Rollback Plan.

---

## Phase 3 — Permission Request

The following actions REQUIRE human authorization:

- Package installation
- Database migration
- Infrastructure modification
- Secret injection
- Cloud provisioning
- CI/CD edits
- Production deployment

No exceptions.

---

## Phase 4 — Controlled Execution

Once approved:
- Execute minimal scoped modifications
- Preserve architectural boundaries
- Maintain deterministic behavior
- Generate audit logs

---

## Phase 5 — Verification Pipeline

All modifications MUST pass:

| Verification Layer | Requirement |
|---|---|
| Linting | Zero warnings |
| Type Checking | Strict mode |
| Testing | 100% coverage |
| Security Scan | Zero critical issues |
| Boundary Validation | No illegal imports |
| Runtime Inspection | No memory leaks |

---

# 5. Unified Permission System

The repository operates under:

```txt id="h2u5vb"
ALLOW → ASK → DENY
```

---

## ALLOW

Agents MAY:
- Read files
- Parse schemas
- Analyze tests
- Inspect telemetry
- Generate plans

---

## ASK

Human authorization REQUIRED for:
- `npm install`
- `pnpm install`
- `pip install`
- Docker changes
- Terraform execution
- Shell execution
- Git branch deletion
- Secret modification

---

## DENY

Agents are strictly prohibited from:
- Arbitrary shell injection
- Global filesystem modification
- Unsigned external API integration
- Recursive self-modification
- Security policy overrides
- Telemetry exfiltration
- Credential harvesting

Immediate termination required upon detection.

---

# 6. Workspace Boundary Enforcement

The repository root is the maximum writable scope.

---

## Mandatory Rule

`.antigravity/config.json` MUST contain:

```json id="vf2q3g"
{
  "allowExternalWrites": false
}
```

Agents MAY NOT:
- Write outside workspace root
- Access host machine secrets
- Modify parent directories
- Traverse external mounts

---

# 7. Engineering Constraints

---

## Code Quality Standards

All generated code MUST:
- Use strong typing
- Avoid hidden side effects
- Remain modular
- Include tests
- Pass formatting rules

---

## Function Constraints

Requirements:
- Maximum 50 lines per function
- Single responsibility
- Explicit return types
- Deterministic outputs

---

## Forbidden Patterns

```js id="u2d17e"
eval()
new Function()
prototype mutation
silent catch blocks
```

---

# 8. Security Governance

---

## Mandatory Security Rules

Agents MUST:
- Sanitize all inputs
- Validate schemas
- Use environment variables
- Escape rendered content
- Verify dependency integrity

---

## Secret Handling

Forbidden:
- Hardcoded credentials
- Logging secrets
- Token exposure
- Plaintext storage

---

## Dependency Policy

All dependencies MUST:
- Be signed or trusted
- Pass vulnerability scans
- Remain version pinned

---

# 9. Verification & Validation Matrix

| Stage | Tooling | Enforcement |
|---|---|---|
| Static Analysis | ESLint / SonarQube | Mandatory |
| Type Validation | TypeScript Strict | Mandatory |
| Unit Tests | Vitest / Jest | Mandatory |
| Integration Tests | Playwright / Pytest | Mandatory |
| Security Scan | Snyk / Trivy | Mandatory |
| Runtime Sandbox | Antigravity Runtime | Mandatory |

Failure at any stage blocks merge authorization.

---

# 10. Runtime Safety Constraints

Agents MUST terminate execution if:
- Recursive reasoning loops occur
- Dependency resolution fails 3 times
- Runtime memory exceeds limits
- CPU utilization exceeds thresholds
- Verification repeatedly fails

---

## Emergency Halt Procedure

### Step 1
Interrupt execution:

```txt id="szec6n"
CTRL + C
```

or:

```txt id="0d1wlv"
Halt Thread
```

---

### Step 2
Clear volatile reasoning state:

```bash id="k7x6u9"
antigravity scratchpad --clear
```

---

### Step 3
Restore workspace integrity:

```bash id="0j7xar"
git clean -fd && git checkout HEAD
```

---

# 11. CI/CD Agent Rules

CI agents MAY:
- Run tests
- Validate formatting
- Execute security scans
- Generate build artifacts

CI agents MAY NOT:
- Push directly to protected branches
- Override failing checks
- Inject secrets dynamically

---

## Protected Branches

```txt id="n5t5vi"
main
production
release/*
```

Direct autonomous modification prohibited.

---

# 12. Observability Requirements

All agent actions MUST generate:
- Execution logs
- File modification traces
- Dependency change records
- Verification outputs
- Rollback checkpoints

---

## Required Log Format

```json id="k5o6mj"
{
  "agent": "verification-agent",
  "action": "run-tests",
  "status": "success",
  "timestamp": "2026-05-20T00:00:00Z"
}
```

---

# 13. Preferred Technology Standards

## Frontend
- Next.js 16
- React 19
- TypeScript
- TailwindCSS

## Backend
- Next.js API Routes
- PostgreSQL
- Supabase

## Infrastructure
- Docker
- GitHub Actions
- Railway
- Vercel

---

# 14. Human Oversight Requirements

Humans retain final authority over:
- Production deployment
- Infrastructure changes
- Secret management
- Permission escalation
- Security exceptions
- Merge authorization

Agents are assistants, not autonomous owners.

---

# 15. Revision Metadata

| Field | Value |
|---|---|
| Specification | AGENTS.md |
| Version | v1.0.0 |
| Target Environment | Google Antigravity Enterprise |
| Compliance Model | NASA-Inspired Deterministic Engineering |
| Maintainer Role | Principal Systems Architect |

---

# 16. Final Operational Philosophy

Autonomous systems MUST remain:
- Deterministic
- Explainable
- Auditable
- Constrained
- Observable
- Reversible

Every automated action must:
- Respect workspace boundaries
- Preserve rollback capability
- Maintain structural integrity
- Leave an audit trail

Reliability is mandatory.
Safety is non-negotiable.

---

# END OF AGENT SPECIFICATION