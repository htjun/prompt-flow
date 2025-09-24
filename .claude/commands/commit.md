---
allowed-tools: Bash(npm run format), Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*)
description: Commit current changes with formatting
argument-hint: [optional commit message]
---

Commit the current changes to git following these requirements:

1. First, run `npm run format` to format all code
2. Check git status to see what files have changed
3. Review the changes with git diff to understand what's being committed
4. Stage all changes with git add
5. Create a descriptive commit message that:
   - Does NOT use any prefix (no "feat:", "fix:", "chore:", etc.)
   - Does NOT mention phase numbers
   - Does NOT include Claude as co-author
   - Focuses on WHAT changed and WHY, not how
   - Is concise but descriptive
6. Commit the changes WITHOUT bypassing pre-commit hooks (let them run naturally)

If the user provides arguments with $ARGUMENTS, use that as the commit message (still following the guidelines above).

Important reminders:

- Never use --no-verify flag
- Never add "Co-Authored-By: Claude" to commits
- Keep commit messages clean and professional
- If pre-commit hooks fail, fix the issues before retrying
