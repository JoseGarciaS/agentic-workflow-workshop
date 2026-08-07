# Mona's CI Fixer Notes

Use these notes when fixing Mona's Issue Triage API build.

- Determine the branch that failed CI from the triggering `workflow_run` event's `head_branch`.
- You already start on that failing branch — the workflow checks it out for you before you run, so the buggy code is in your workspace. Do not try to fetch or switch branches yourself; just confirm with `git status` and work from there.
- Reproduce the failure locally with `cd app && npm test`.
- Read the failing assertion carefully before editing anything.
- The tests cover the pure domain helpers in `app/src/domain.mjs`; start there.
- Make the smallest source change that restores the intended behavior.
- Do not reconstruct the branch's changes on top of `main`. Fix the code that is already in your workspace on the failing branch, so your fix is a minimal diff against that branch and stacks cleanly.
- Do not rewrite unrelated code, update generated files, or hide a failing test.
- Open the fix as a stacked pull request whose base is the failing branch, never `main`, using `safe-outputs: create-pull-request` with `base` set to the failing branch as permitted by `allowed-base-branches`.
- Name the fix branch `<failing-branch>-fix`.
- Keep the PR description friendly and mention the test command you ran.
