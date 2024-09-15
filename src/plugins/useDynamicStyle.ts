import { type App, type ConcreteComponent } from 'vue'

type CustomElementWithStyles = ConcreteComponent & {
  styles?: string[]
}

/**
 * Divide o CSS em blocos de regras e processa seletivamente os seletores.
 * Adiciona o prefixo antes de cada seletor, mesmo que seja uma lista separada por vírgula.
 * Evita adicionar prefixo a regras @ (como "@media", "@keyframes")
 * @param {string} css - O conteúdo do CSS a ser processado
 * @param {string} prefix - O prefixo a ser adicionado aos seletores
 * @returns {string} O CSS processado com os seletores prefixados
 */
export const prefixSelectors = (css, prefix) => {
  // Divide o CSS em blocos de regras e processa seletivamente os seletores
  return css.replace(/([^{}]+)\s*\{/g, (match, selector) => {
    // Evita adicionar prefixo a regras @ (como @media, @keyframes)
    if (selector.trim().startsWith('@')) {
      return match // Não modifica regras como @media
    }

    // Adiciona o prefixo antes de cada seletor, mesmo que seja uma lista separada por vírgula
    const prefixedSelector = selector
      .split(',')
      .map((sel) => `${prefix} ${sel.trim()}`) // Adiciona o prefixo ao seletor
      .join(', ')

    return `${prefixedSelector} {`
  })
}

/**
 * Plugin que adiciona estilos ao componente e os remove quando o componente é desmontado.
 * Os estilos são prefixados com o nome do componente para evitar conflitos com outros componentes.
 * @param {string} webComponentName - O nome do componente web.
 * @returns {Object} Um plugin que pode ser instalado em um aplicativo Vue.
 */
export const useDynamicStyle = (webComponentName: string) => ({
  install: (app: App) => {
    if (!app || !app._component) return
    app.mixin({
      mounted() {
        const component = app._component as CustomElementWithStyles
        if (component.styles && !!component.styles.length) {
          component.styles.forEach((style) => {
            const findStyle = document.getElementById(`style-${component.name}`)
            if (!findStyle) {
              const styleTag = document.createElement('style')
              styleTag.id = `style-${component.name}`
              styleTag.innerHTML = prefixSelectors(style, webComponentName)
              document.head.appendChild(styleTag)
            }
          })
        }
      },
      beforeUnmount() {
        const component = app._component as CustomElementWithStyles
        if (component.styles && !!component.styles.length) {
          component.styles.forEach(() => {
            const findStyle = document.getElementById(`style-${component.name}`)
            if (findStyle) {
              document.head.removeChild(findStyle)
            }
          })
        }
      }
    })
  }
})
