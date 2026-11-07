# Pre-commit Quality Workflow

Workflow to run before committing changes to git.

## Steps

1. **Format & Linting**
   ```bash
   npx eslint --fix src/
   npm run lint
   ```

2. **Type Checking & Build**
   ```bash
   npm run build
   ```

3. **Automated Testing**
   ```bash
   npm test
   ```

4. **Verify Standards**
   - Confirm no untracked `console.log` statements remain.
   - Confirm all components use `ChangeDetectionStrategy.OnPush`.
   - Confirm Tailwind v4 classes use `!` as postfix (e.g., `py-1!`).

