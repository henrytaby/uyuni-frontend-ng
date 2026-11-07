# Agent Skills - UyuniAdmin Frontend

This directory contains executable or standardized **Skills** that AI agents can discover, read, and execute when performing specialized tasks.

## Structure of a Skill

Each skill is a self-contained directory containing:
```
.agents/skills/<skill-name>/
├── SKILL.md          # Primary instructions with YAML frontmatter (name, description)
├── scripts/          # (Optional) Shell / Node scripts used by the skill
└── references/       # (Optional) Cheatsheets, schemas, or templates
```

## Available Skills

| Skill | Description | Location |
|-------|-------------|----------|
| `scaffold-feature` | Scaffolds a new DDD-Lite compliant feature module in `src/app/features/` | [`scaffold-feature/SKILL.md`](./scaffold-feature/SKILL.md) |
| `audit-code` | Audits components against Angular 21, OnPush, Signal, and Tailwind v4 standards | [`audit-code/SKILL.md`](./audit-code/SKILL.md) |

## Adding New Skills

1. Create a subdirectory under `.agents/skills/<skill-name>`.
2. Add a `SKILL.md` with:
   ```markdown
   ---
   name: your-skill-name
   description: Brief explanation of what the skill does and when an agent should invoke it.
   ---

   # Your Skill Title

   ## When to Use
   ...
   ## Steps
   ...
   ```

