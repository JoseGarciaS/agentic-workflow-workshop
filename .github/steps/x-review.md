## Revisión

_¡Felicidades, completaste **Agentic Workflows That Fix the Build** y ayudaste a Mona a construir un workflow de CI que se cura solo!_ 🎉

<img src="https://octodex.github.com/images/jetpacktocat.png" alt="Mona celebrating a green build" width=200 align=right>

Trae los últimos cambios de `main` y luego echa un vistazo al stacked pull request del reparador ya mergeado y a la ejecución final de **CI** en verde de la Issue Triage API de Mona.

<!-- TODO screenshot: final green CI run and merged fixer pull request. -->

Esto es lo que lograste:

- **Configuraste GitHub Agentic Workflows** — Instalaste el soporte de `gh aw`, agregaste los archivos de configuración y preparaste el repositorio para compilar agentic workflows.
- **Conociste la API y el pipeline de CI de Mona** — Trabajaste con la Issue Triage API basada en Express y confirmaste que sus tests de Node.js parten de una base en verde.
- **Construiste un workflow `autofix-ci`** — Escribiste y compilaste un agentic workflow que puede inspeccionar CI cuando falla, reproducir `npm test`, hacer una corrección mínima y abrir un stacked fix pull request en la branch que falló.
- **Practicaste el CI autorreparable** — Introdujiste un bug prescrito, viste fallar CI y observaste al workflow reparador responder.
- **Revisaste la corrección** — Inspeccionaste el stacked pull request generado, le hiciste merge a `introduce-bug`, y luego hiciste merge del pull request original del bug a `main` después de que CI volvió a estar en verde.

### ¿Qué sigue?

- **Ajusta el prompt del reparador** con guardrails adicionales para el alcance de los tests, el estilo de los commits o las reglas de escalado.
- **Agrega más señales de CI** como linting, type checks o tests de integración para que el reparador los diagnostique.
- **Crea workflows complementarios** para que haga un chequeo de tests inestables, fallos de actualización de dependencias o priorización de issues.
- **Explora más documentación** en el [sitio de GitHub Agentic Workflows](https://github.github.com/gh-aw/).
