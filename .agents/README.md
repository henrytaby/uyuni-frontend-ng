# .agents - AI Agent Ecosystem & Project Standards

This directory represents the standardized, tool-agnostic configuration for AI coding agents and assistants (Antigravity, Claude Code, Cursor, Copilot, Roo Code, etc.) working on the **UyuniAdmin Frontend** repository.

## Directory Overview

```
.agents/
├── README.md               # This index
├── memory/                 # Architectural memory bank, domain models, and decision history
│   ├── README.md           # Memory bank index
│   ├── architecture-patterns.md
│   ├── authentication.md
│   ├── coding-standards.md
│   ├── decisions-history.md
│   ├── features-modules.md
│   ├── project-overview.md
│   ├── services-reference.md
│   ├── tech-stack.md
│   └── ui-ux-guidelines.md
├── rules/                  # Modular coding guidelines and framework rules
│   ├── README.md           # Rules index
│   ├── project-rules.md    # Core principles and quick reference
│   ├── angular-standards.md# Angular 21, Signals, Standalone, OnPush, DI
│   ├── primeng-standards.md# PrimeNG 21, @primeuix/themes, Lucide icons
│   └── tailwind-v4.md      # Tailwind v4 syntax, ! postfix, ERP density
├── skills/                 # Self-contained executable agent skills (SKILL.md)
│   ├── scaffold-feature/   # Skill to scaffold DDD Lite feature modules
│   └── audit-code/         # Skill to audit code compliance
└── workflows/              # Step-by-step developer and agent workflows
    ├── new-feature.md      # Workflow to implement new features
    └── pre-commit-check.md # Quality check workflow
```

## Primary Entry Point
For quick context, agents must consult the unified root file:
- [`AGENTS.md`](../AGENTS.md)

