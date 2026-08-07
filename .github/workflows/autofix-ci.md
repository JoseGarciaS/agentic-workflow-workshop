---
name: Autofix CI
on:
  workflow_dispatch:
    inputs:
      branch:
        description: Branch to fix when running manually
        required: true
        type: string
  workflow_run:
    workflows: [CI]
    types: [completed]
if: github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'failure'
permissions:
  contents: read
  actions: read
  pull-requests: read
engine: copilot
steps:
  # Check out the failing branch on the runner before the agent starts.
  - name: Checkout the failing branch
    uses: actions/checkout@v5
    with:
      ref: ${{ github.event.workflow_run.head_branch || github.event.inputs.branch }}
      fetch-depth: 0
      persist-credentials: false
safe-outputs:
  create-pull-request:
    draft: false
    preserve-branch-name: true
    allowed-base-branches:
      - "**"
      - "!main"
      - "!master"
network:
  allowed:
    - defaults
---

# Fix Mona's failing CI build on the pull request branch

You are helping maintain Mona's Issue Triage API. The CI workflow just failed.
Diagnose the failure and open a pull request that fixes it on the branch that
failed, not on main.

Read notes/ci-fix-guide.md before making changes.

Determine the branch whose CI run failed:
- On an automatic run, use the triggering workflow_run event's head_branch.
- On a manual run, use the workflow_dispatch branch input.

The workflow's steps block has already checked out this failing branch for you,
so the buggy code is already in your workspace. Do not fetch or switch branches
manually inside the sandbox.

Confirm where you are, then reproduce the failure:

```bash
git status
cd app && npm test
```

Read the failing assertion, identify the function in app/src/domain.mjs that
must change, and make the smallest fix that turns the tests green. Avoid
unrelated refactors, formatting-only edits, dependency updates, and edits
outside app/src/domain.mjs unless the failing assertion proves they are needed.

Run cd app && npm test again to confirm the fix.

Open a pull request with safe-outputs create-pull-request:
- Set the pull request base to the failing branch you identified, never main.
- Name the fix branch by appending -fix to the failing branch name.
- Keep the description friendly and mention the test command you ran.

Never push directly to main and never target main as the base branch.
