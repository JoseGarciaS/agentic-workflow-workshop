## Step 4: Revisa la corrección de CI de Mona y confirma que el build está en verde

El agentic workflow ha diagnosticado el test que falla y ha abierto un stacked pull request con una corrección propuesta en el código. En este paso final, revisarás ese cambio generado, le harás merge a `introduce-bug`, confirmarás que el pull request original del bug se pone en verde y luego harás merge del pull request original a `main`.

### 📖 Teoría: Revisión humana para CI autorreparable

El CI que se cura solo (self-healing) debe mantener a las personas en control. El agente puede reproducir el fallo, razonar sobre la salida del test y proponer un parche mínimo, pero `safe-outputs: create-pull-request` mantiene el cambio en un pull request para revisión antes de que llegue a la branch que falló o a `main`.

Hacer merge del stacked pull request del reparador actualiza el pull request del bug que sigue abierto. Eso vuelve a ejecutar **CI** en el pull request del bug para que puedas validar la corrección antes de hacer merge del pull request original del bug a `main`. Hacer merge del pull request original del bug a `main` dispara el workflow final de calificación, que ejecuta `npm ci && npm test` en `app/` sobre `main`, confirma que el build está en verde y luego completa el ejercicio.

### :keyboard: Actividad: Revisa el stacked fix y haz merge del pull request del bug en verde

1. Abre la pestaña **Pull requests** en tu repositorio.

2. Encuentra el stacked pull request abierto por el agentic workflow reparador. Debería apuntar a la branch `introduce-bug`, no a `main`, y su título debería mencionar arreglar el build, CI o la Issue Triage API de Mona.

3. Abre el pull request y revisa la pestaña **Files changed**.

   Confirma que el diff actualice `app/src/domain.mjs` y corrija el helper que causó el test fallido. La corrección debe ser pequeña y enfocada.

   <!-- TODO screenshot: fixer pull request Files changed tab showing app/src/domain.mjs -->

4. Revisa el stacked pull request con cuidado y luego hazle merge a `introduce-bug`.

   Este stacked pull request **no** tiene checks de CI propios porque apunta a la feature branch, y el workflow de **CI** solo se ejecuta para pull requests hacia `main`(eso se puede cambiar). Revisa el diff y haz merge tras la revisión; la validación ocurre cuando el pull request original del bug se vuelve a ejecutar.

   El ejemplo establece `draft: false`, así que el pull request del reparador debería poder mergearse directamente. Si tu reparador produjo un pull request en draft de todos modos, haz clic en **Ready for review** antes de hacer merge.

5. Vuelve al pull request original del bug hacia `main`.

   Después de que el stacked fix se mergea a `introduce-bug`, GitHub sincroniza el pull request original y vuelve a ejecutar **CI**. Espera a que esa ejecución de **CI** se ponga en verde.

6. Haz merge del pull request original del bug a `main`.

7. Abre la pestaña **Actions** y selecciona el workflow **CI**. Confirma que la última ejecución en `main` está en verde.

8. Espera unos 20 segundos y luego actualiza el issue del ejercicio para la revisión final.

<details>
<summary>¿Tienes problemas? 🤷</summary><br/>

- Si no aparece ningún pull request del reparador, abre la pestaña **Actions** y revisa la ejecución del workflow `autofix-ci`. Confirma que `COPILOT_GITHUB_TOKEN` esté configurado, y confirma que **Allow GitHub Actions to create and approve pull requests** esté habilitado en la configuración de Actions del repositorio.
- Si el reparador no se ejecutó automáticamente, usa el botón **Run workflow** en el workflow `autofix-ci` como válvula de seguridad.
- Si el pull request del reparador apunta a la branch base equivocada, confirma que `allowed-base-branches` permita `introduce-bug*` y que tu prompt del reparador le indique al agente usar el `head_branch` de la ejecución del workflow que falló como base del pull request.
- Si el pull request cambia archivos distintos de `app/src/domain.mjs`, revísalo con cuidado. Mona quiere la corrección mínima en el código que haga pasar `cd app && npm test`.
- Si el pull request original del bug sigue en rojo, confirma que el stacked pull request del reparador se haya mergeado a `introduce-bug`. El pull request original solo se pone en verde después de que el stacked fix se mergea.
- El paso final de calificación solo se completa después de que el pull request original del bug se haya mergeado a `main` y los tests estén en verde en `main`.

</details>
