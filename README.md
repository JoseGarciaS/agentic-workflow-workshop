# Agentic Workflows That Fix the Build

_Aprende a instalar GitHub Agentic Workflows y a crear un workflow con IA que ayuda a Mona a mantener CI en verde arreglando builds que fallan._

## Bienvenida

- **Para quién es esto**: personas desarrolladoras, ingenieras de DevOps y cualquiera con curiosidad por la automatización autorreparable (self-healing) en repositorios de GitHub.
- **Lo que aprenderás**: cómo instalar la extensión `gh aw`, escribir un agentic workflow en markdown, compilarlo y usarlo para diagnosticar fallos de CI y abrir un pull request con la corrección.
- **Lo que construirás**: la Issue Triage API de Mona más un agentic workflow `autofix-ci` que observa el workflow de CI, reproduce un test de Node.js que falla, hace la corrección mínima en el código y abre un pull request para revisión.
- **Requisitos previos**:
  - Una cuenta de GitHub con acceso a GitHub Copilot
  - Familiaridad básica con repositorios de GitHub, branches y pull requests
  - Comodidad editando archivos YAML y Markdown

- **Duración**: este ejercicio se completa en menos de 45 minutos.

En este ejercicio, vas a:

1. Configurar GitHub Agentic Workflows y conocer el pipeline de CI en verde de Mona para la Issue Triage API.
1. Escribir y compilar un agentic workflow `autofix-ci` que pueda investigar tests que fallan y abrir un PR con la corrección.
1. Introducir un bug prescrito, ver fallar CI y dejar que el workflow reparador se ejecute automáticamente.
1. Revisar el pull request del reparador, hacer merge y confirmar que CI vuelve a estar en verde.

### Cómo empezar este ejercicio

Simplemente copia el ejercicio a tu cuenta, luego dale a tu Octocat favorita (Mona) **unos 20 segundos** para preparar la primera lección y después **actualiza la página**.

> [!IMPORTANT]
> Este ejercicio está diseñado para copias de repositorio **públicas**.
> Si copiaste el ejercicio como repositorio privado, la configuración del token
> puede requerir ajustes adicionales de políticas de cuenta u organización.

[![](https://img.shields.io/badge/Copy%20Exercise-%E2%86%92-1f883d?style=for-the-badge&logo=github&labelColor=197935)](https://github.com/new?template_owner=codinglatamdevcon&template_name=agentic-workflow-workshop&owner=%40me&name=agentic-workflow-workshop&description=Exercise:+Agentic+Workflows+That+Fix+the+Build&visibility=public)

<details>
<summary>¿Tienes problemas? 🤷</summary><br/>

Al copiar el ejercicio, recomendamos la siguiente configuración:

- Para el owner, elige tu cuenta personal o una organización que aloje el repositorio.

- Recomendamos crear un repositorio público, ya que los repositorios privados consumen minutos de Actions.

Si el ejercicio no está listo en 20 segundos, revisa la pestaña [Actions](../../actions).

- Comprueba si hay un job en ejecución. A veces simplemente tarda un poco más.

- Si la página muestra un job fallido, envía un issue. ¡Bien, encontraste un bug! 🐛

</details>

---

&copy; 2026 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)
