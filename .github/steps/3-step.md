## Step 3: Introduce un bug y observa cómo falla la CI

En el Step 2 construiste el workflow reparador de Mona. Ahora simularás un error real de un desarrollador en la Issue Triage API de Mona para que **CI** falle en un pull request abierto y el reparador pueda responder con un stacked fix PR.

### 📖 Teoría: Un fallo seguro para que el reparador lo diagnostique

Introducirás un bug agregando un nuevo helper `topPriority` a la Issue Triage API de Mona. Se supone que debe devolver primero los issues con mayor puntuación, pero se publica con el orden invertido, así que un nuevo test falla y **CI** se pone en rojo. Ese es exactamente el tipo de fallo que un agentic-workflow que repara build debería atrapar en un pull request antes de que llegue a `main`.

Agregarás esa funcionalidad y su test en una nueva branch llamada `introduce-bug`, abrirás un pull request hacia `main` y lo dejarás abierto. La **CI** se inicia cuando se abre el pull request; el push por sí solo no inicia CI porque el trigger de push solo observa `main`. Cuando **CI** se ponga en rojo, el agentic workflow `autofix-ci` que creaste en el Step 2 debería ejecutarse automáticamente porque escucha las ejecuciones fallidas de **CI**, y luego abrir un stacked fix PR cuya base sea `introduce-bug`.

> [!IMPORTANT]
> **No** habilites required status checks ni branch protection para este repositorio del taller. Este taller crea y repara intencionalmente un pull request que falla, y los required checks pueden complicar el flujo de la demostración.

### :keyboard: Actividad: Agrega una funcionalidad rota e inspecciona la ejecución fallida

1. En la ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff) **ventana de terminal**, asegúrate de que tu branch local `main` esté actualizada, luego crea una nueva branch para el error simulado.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > git checkout main
   > git pull
   > git checkout -b introduce-bug
   > ```

2. Abre `app/src/domain.mjs` y agrega un nuevo helper `topPriority` al final del archivo.

   Se supone que debe devolver primero los issues con mayor puntuación, pero se publica con el comparator invertido (ascendente en lugar de descendente), así que devuelve los issues de *menor* prioridad:

   ```js
   export function topPriority(issues, count) {
     const limit = Math.max(0, Math.trunc(Number(count)) || 0);
     return [...issues]
       .map((issue) => ({ issue, score: scoreIssue(issue) }))
       .sort((a, b) => a.score - b.score)
       .slice(0, limit)
       .map(({ issue }) => issue);
   }
   ```

3. Abre `app/test/domain.test.mjs` y agrega un test para el nuevo helper.

   Primero agrega `topPriority` al import en la parte superior del archivo.

   Antes:

   ```js
   import { filterByLabel, paginate, scoreIssue, sortByPriority } from '../src/domain.mjs';
   ```

   Después:

   ```js
   import { filterByLabel, paginate, scoreIssue, sortByPriority, topPriority } from '../src/domain.mjs';
   ```

   Luego agrega este test suite al final del archivo:

   ```js
   describe('topPriority', () => {
     it('returns the highest scoring issues first', () => {
       assert.deepEqual(
         topPriority(fixtures, 2).map((issue) => issue.id),
         ['critical-bug', 'security'],
         'topPriority should list issues from highest score to lowest score'
       );
     });
   });
   ```

4. Haz commit de ambos archivos y push de tu branch.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > git add app/src/domain.mjs app/test/domain.test.mjs
   > git commit -m "Add topPriority helper with a sort bug"
   > git push -u origin introduce-bug
   > ```

5. Abre el pull request hacia `main` con un título como `Add topPriority helper`, luego deja el pull request abierto.

   **No** hagas merge de este pull request todavía. Abrir el pull request inicia **CI**, y esta primera ejecución de CI debería ponerse en rojo.

   <!-- TODO screenshot: open pull request that introduces the topPriority sort bug -->

6. Abre la pestaña **Actions** y selecciona el workflow **CI**.

7. Abre la ejecución fallida de **CI** para el pull request y lee el output del test. Deberías ver el mensaje de la test fallida:

   ```text
   topPriority should list issues from highest score to lowest score
   ```

   <!-- TODO screenshot: CI run log showing the failing topPriority assertion -->

8. Vuelve a la pestaña **Actions** y observa el workflow `autofix-ci`. Como **CI** falló en el pull request5, el agentic-workflow de Mona debería iniciarse automáticamente y trabajar hacia un stacked pull request que repare el build con la base branch `introduce-bug`.

   <!-- TODO screenshot: autofix-ci workflow run triggered after the failed CI run -->

9. Espera unos 20 segundos y luego actualiza el issue del ejercicio. Mona verificará que el helper `topPriority` con el bug y su test estén presentes en el pull request abierto `introduce-bug` antes de publicar el Step 4. El reparador puede tardar unos minutos en abrir su stacked PR, así que mantén el pull request abierto mientras esperas.

<details>
<summary>¿Tienes problemas? 🤷</summary><br/>

- Si **CI** no falla, confirma que `app/src/domain.mjs` contiene `a.score - b.score` dentro de la nueva función `topPriority`, y confirma que `app/test/domain.test.mjs` importa y prueba `topPriority`, en el pull request abierto `introduce-bug`.
- Recuerda que **CI** se inicia cuando se abre el pull request 5, no cuando haces push de `introduce-bug`.
- Si el workflow `autofix-ci` no se inicia automáticamente, primero vuelve a provocar un fallo real de **CI** para que se dispare un nuevo evento `workflow_run`: haz push de un commit vacío a `introduce-bug`, o cierra y vuelve a abrir el pull request 5.
- Si aún necesitas una válvula de seguridad manual, abre la pestaña **Actions**, selecciona `autofix-ci`, y usa **Run workflow** solo si tu ejemplo incluye el input `branch` de `workflow_dispatch`, usando `introduce-bug` como branch.
- Confirma que el secret `COPILOT_GITHUB_TOKEN` esté configurado como un Actions secret.
- Abre los logs de la ejecución de `autofix-ci` y lee la salida del agente para la siguiente pista.
- Confirma que `allowed-base-branches` permite la feature branch que falla (por ejemplo con `**`) y excluye `main`.

</details>
