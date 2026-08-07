## Step 2: Crea el workflow que arregla el build

Buen trabajo dejando listos los agentic workflows. Ahora es momento de enseñarle al repositorio de Mona cómo reaccionar cuando el workflow de **CI** falla en una branch de pull request.

### 📖 Teoría: Los agentic workflows como compañeros de CI

Un agentic workflow puede inspeccionar una ejecución que falla, leer las notas del repositorio, reproducir un fallo localmente, hacer un pequeño cambio de código y abrir un pull request para revisión humana. En este taller, el reparador abre un **stacked pull request** contra la branch que hizo fallar CI, de modo que el pull request original pueda ponerse en verde antes de mergear a `main`.

En este paso, le pedirás al agente **agentic-workflows** que cree `.github/workflows/autofix-ci.md`, lo compile con `gh aw` y hagas merge del pull request de configuración.

### :keyboard: Actividad: Crea el agentic-workflow

Sigue trabajando en VS Code. Si cerraste tu editor del navegador, vuelve a abrir tu entorno de desarrollo desde el menú **Code** de tu repositorio.

1. En la nueva ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff) **ventana de terminal**, usa el atajo de teclado `Ctrl + I` (Windows) o `Cmd + I` (Mac) para abrir el **Terminal Inline Chat de Copilot**.

2. Pídele a Copilot que cree una branch para el trabajo del workflow.

   > ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=social&logo=github%20copilot)
   >
   > ```prompt
   > Hey copilot,
   > - Asegurate que este mi main branch este actualizada
   > - Crea una nueva branch llamada create-build-fixer-workflow.
   > ```

   > 💡 **Tip:** Si Copilot no te da exactamente lo que quieres, puedes seguir explicando lo que necesitas. Copilot recordará el historial de la conversación para las respuestas de seguimiento.

3. Abre el **panel de Copilot Chat** con `Ctrl + Alt + I` (Windows) o `Ctrl + Cmd + I` (Mac). Selecciona el agente **agentic-workflows** en el selector de agentes y dale acceso para editar archivos en el repositorio.

> [!NOTE]
> El agente agentic-workflows es un agente de propósito general que nos ayuda a crear agentic-workflows y puede seguir instrucciones en archivos markdown. Lo usarás para redactar la definición del workflow, y luego compilarás el workflow tú mismo.

   <!-- TODO screenshot: Select the agentic-workflows agent in Copilot Chat. -->

4. Antes de dar instrucciones al agente, agrega una regla a `.github/agents/agentic-workflows.md` para que el agente sepa que no debe compilar los workflows por su cuenta. Abre el archivo y agrega la siguiente línea bajo Important Notes:

   ```markdown
   When creating or editing agentic workflow files, do not compile them. Only create or update the markdown workflow file.
   ```

5. Pídele al agente agentic-workflows que cree el archivo del workflow reparador del build.

   > ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=social&logo=github%20copilot)
   >
   > ```prompt
   > Create .github/workflows/autofix-ci.md as an agentic workflow markdown file.
   >
   > Requirements:
   > - Use the Copilot engine.
   > - Trigger on workflow_dispatch and on workflow_run for the CI workflow when a run completes with conclusion failure.
   > - Do not scope the workflow_run trigger to main; it must react to CI failures on pull request branches.
   > - Use safe-outputs with create-pull-request, set draft false, preserve the branch name, and with allowed-base-branches allow any feature branch as a base while excluding the protected branches main and master.
   > - Declare network access with the default allowlist.
   > - Tell the agent to read notes/ci-fix-guide.md before changing code.
   > - Tell the agent to determine the failing branch from the workflow_run head_branch on automatic runs, or from the workflow_dispatch branch input on manual runs.
   > - Add a steps: block to the workflow that checks out the failing branch on the runner before the agent runs. Use actions/checkout with fetch-depth 0, persist-credentials false, and ref set to the workflow_run head_branch, falling back to the workflow_dispatch branch input. This is required because the default checkout is healthy main, and the agent cannot fetch the branch itself from inside its sandbox.
   > - Tell the agent to reproduce the failure with cd app && npm test.
   > - Tell the agent to read the assertion, find the smallest needed source fix in app/src/domain.mjs, and avoid unrelated changes.
   > - Tell the agent to open the fix as a stacked pull request whose base is the failing branch, never main, and name the fix branch by adding -fix to the failing branch.
   > - Check that the markdown workflow syntax is valid.
   > - Do not compile the workflow.
   > ```

### :keyboard: Activity: Review and compile the `autofix-ci.md` Agentic Workflow

1. Revisa `.github/workflows/autofix-ci.md`. Debería verse similar a esta referencia:

   ````markdown
   ---
   on:
     workflow_dispatch:
       inputs:
         branch:
           description: "Failing branch to fix (used only for manual runs)"
           required: false
           default: "introduce-bug"
     workflow_run:
       workflows: ["CI"]
       types: [completed]
   if: github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'failure'
   permissions:
     contents: read
     actions: read
     pull-requests: read
   engine: copilot
   steps:
     # Check out the branch whose CI failed, on the runner, before the agent starts.
     - name: Checkout the failing branch
       uses: actions/checkout@v5
       with:
         ref: FAILING_BRANCH   # runtime expression — see the note under this sample
         fetch-depth: 0
         persist-credentials: false
   safe-outputs:
     create-pull-request:
       draft: false
       allowed-base-branches:
         - "**"
         - "!main"
         - "!master"
       preserve-branch-name: true
   network:
     allowed:
       - defaults
   ---

   # Fix Mona's failing CI build on the pull request branch

   You are helping maintain Mona's Issue Triage API. The **CI** workflow just failed.
   Diagnose the failure and open a pull request that fixes it **on the branch that
   failed**, not on `main`.

   Read `notes/ci-fix-guide.md` before making changes.

   Determine the branch whose CI run failed. On an automatic run, use the triggering
   `workflow_run` event's `head_branch` (for example `introduce-bug`). On a manual run,
   use the `branch` input. This is the branch you will target as the base of your fix.

   The workflow's `steps:` block has **already checked out this failing branch for you**,
   so the buggy code is right there in your workspace — you do not need to fetch or
   switch branches. Confirm where you are, then reproduce the failure:

   ```bash
   git status
   cd app && npm test
   ```

   Read the assertion message, identify the function in `app/src/domain.mjs` that must
   change, and make the smallest fix that turns the tests green. Avoid unrelated
   refactors, formatting-only changes, dependency updates, and edits outside
   `app/src/domain.mjs` unless the failing test proves they are needed.

   Run `cd app && npm test` again to confirm the fix.

   Open a pull request with `safe-outputs` `create-pull-request`:
   - Set the pull request **base** to the failing branch you identified, so your fix
     stacks on top of that branch instead of `main`.
   - Name your fix branch after the failing branch with a `-fix` suffix, for example
     `introduce-bug-fix`.
   - Keep the description friendly and mention the test command you ran.

   Never push directly to `main` and never target `main` as the base branch.
   ````

   > [!NOTE]
   > En la referencia anterior, el `ref` del checkout se muestra como `FAILING_BRANCH` temporalmente. En tu archivo generado es una expresión de tiempo de ejecución real de GitHub Actions que lee la head branch del `workflow_run` en las ejecuciones automáticas y recurre al input manual `branch` — por ejemplo el valor de `github.event.workflow_run.head_branch`. Mantén `persist-credentials: false`; el workflow no compilará sin ello.

   > [!IMPORTANT]
   > `allowed-base-branches` es una barrera de seguridad (guardrail): limita a qué branches puede apuntar el agentic-workflow. El patrón `**` le permite crear (stack) un arreglo sobre cualquier feature branch que haya hecho fallar CI, mientras que `!main` y `!master` evitan que abra un arreglo directamente contra tu branch protegido. En tus propios repositorios puedes ajustar `**` para que coincida con tu convención de nombres de branches si quieres un radio de impacto más acotado.

2. Compila el agentic workflow en la ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff) **ventana de terminal**.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > gh aw compile autofix-ci
   > ```

   El comando de compilación debería crear `.github/workflows/autofix-ci.lock.yml`.

3. Asegúrate de que los archivos del workflow incluyan estas piezas importantes:

   - `.github/workflows/autofix-ci.md` existe.
   - `.github/workflows/autofix-ci.lock.yml` existe.
   - `autofix-ci.md` incluye `workflow_dispatch`, `workflow_run`, `CI`, `conclusion`, `safe-outputs`, `create-pull-request`, `allowed-base-branches`, `network`, `steps`, `persist-credentials`, y `notes/ci-fix-guide.md`.
   - `autofix-ci.lock.yml` referencia `COPILOT_GITHUB_TOKEN`.
   - `.github/agents/agentic-workflows.md` incluye la regla de no compilar automáticamente de este paso.

4. En la ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff) **ventana de terminal**, haz commit y push de los archivos generados tú mismo. `git add -A` deja en stage tanto los archivos de configuración del Step 1 como el nuevo workflow reparador.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > git add -A
   > git commit -m "Create Mona build fixer workflow"
   > git push -u origin create-build-fixer-workflow
   > ```

   Luego abre un pull request desde `create-build-fixer-workflow` hacia `main` con el título `Create Mona build fixer workflow`.

5. Haz merge del pull request en `main`. Espera unos 20 segundos y luego actualiza el issue del ejercicio para el siguiente paso.

<details>
<summary>¿Tienes problemas? 🤷</summary><br/>

- La verificación de calificación busca `.github/workflows/autofix-ci.md` y `.github/workflows/autofix-ci.lock.yml`.
- Incluye las frases `safe-outputs`, `create-pull-request`, `workflow_run`, `workflow_dispatch`, `network`, `CI`, `conclusion`, `allowed-base-branches`, `steps`, `persist-credentials`, y `notes/ci-fix-guide.md` en `.github/workflows/autofix-ci.md`.
- Confirma que `allowed-base-branches` permite feature branches (por ejemplo con `**`) pero excluye `main`, de modo que el reparador cree un stacked pull request contra la branch que falló en lugar del trunk.
- Asegúrate de que el workflow tenga un bloque `steps:` que haga checkout de la branch que falló (desde el `head_branch` del `workflow_run`, o el input manual `branch`) con `persist-credentials: false`. Sin esto, el reparador se ejecuta contra `main` sano, no puede reproducir el bug, y su pull request termina vacío o con conflictos.
- Incluye la regla de no compilar automáticamente en `.github/agents/agentic-workflows.md`: `Only create or update the markdown workflow file.`
- Si `gh aw compile autofix-ci` falla, compara tu frontmatter con la referencia anterior e intenta compilar de nuevo.

</details>
