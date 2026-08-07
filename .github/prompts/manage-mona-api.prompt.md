---
description: Start, stop, restart, or test Mona's Issue Triage API for local development or Codespaces.
name: manage-mona-api
argument-hint: Choose start, stop, restart, or test. You can also include an optional port.
agent: agent
---

# Manage Mona's Issue Triage API

Manage the Express API in the `app/` directory for this repository.

## Inputs

- The first argument should be one of: `start`, `stop`, `restart`, or `test`.
- Use port `3000` unless I explicitly provide another port.

## Shared rules

- Only act inside this repository.
- Use host `0.0.0.0` when starting the API so it works locally and in GitHub Codespaces.
- Only stop a process when you have the exact PID.
- Never use `pkill`, `killall`, or other name-based process termination.
- If a process on the requested port does not appear to be this repository's Issue Triage API, stop and ask me before killing it.
- Run commands from `app/`.

## Behavior

### If I ask for `start`

1. Check whether the API is already running on the requested port.
2. If it is already this Express API, tell me it is running and report the URL.
3. Otherwise, start the dev server from `app/` with `npm run dev`.
4. Verify `/health` responds over HTTP.

### If I ask for `stop`

1. Find the exact PID listening on the requested port.
2. If nothing is listening, tell me the API is already stopped.
3. If the listener is this Issue Triage API, stop it.
4. Verify the port is no longer listening.

### If I ask for `restart`

1. Find and stop the exact PID currently listening on the requested port, if any.
2. Start the dev server again from `app/` with `npm run dev`.
3. Verify `/health` responds over HTTP.

### If I ask for `test`

1. Run `npm test` from `app/`.
2. Report whether the domain tests passed.
3. If tests fail, summarize the first failing assertion and point to `app/src/domain.mjs`.

## Response format

- Keep the response short.
- Always say what action you took.
- If the API is running, include the exact URL to open.
- If you used a PID, mention it.
