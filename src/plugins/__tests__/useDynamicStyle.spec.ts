import { describe, it, expect } from 'vitest'
import { prefixSelectors } from '../useDynamicStyle'

describe('prefixSelectors', () => {
  it('deve adicionar prefixo aos seletores simples', () => {
    const css = `
      h1 {
        color: red;
      }
    `
    const result = prefixSelectors(css, 'web-component-batata')
    expect(result).toBe(`web-component-batata h1 {
        color: red;
      }
    `)
  })

  it('deve adicionar prefixo a múltiplos seletores', () => {
    const css = `
      h1, h2 {
        color: blue;
      }
    `
    const result = prefixSelectors(css, 'web-component-batata')
    expect(result).toBe(`web-component-batata h1, web-component-batata h2 {
        color: blue;
      }
    `)
  })

  it('não deve adicionar prefixo a regras @media', () => {
    const css = `
      @media (min-width: 1024px) {
        h1 {
          color: green;
        }
      }
    `
    const result = prefixSelectors(css, 'web-component-batata')
    expect(result).toBe(`
      @media (min-width: 1024px) {web-component-batata h1 {
          color: green;
        }
      }
    `)
  })

  it('deve adicionar prefixo a seletores dentro de regras @media', () => {
    const css = `
      @media (max-width: 600px) {
        .greetings h1, .greetings h2 {
          font-size: 1.2rem;
        }
      }
    `
    const result = prefixSelectors(css, 'web-component-batata')
    expect(result).toBe(`
      @media (max-width: 600px) {web-component-batata .greetings h1, web-component-batata .greetings h2 {
          font-size: 1.2rem;
        }
      }
    `)
  })

  it('não deve modificar regras @keyframes', () => {
    const css = `
      @keyframes slidein {
        from {
          transform: translateX(0%);
        }
        to {
          transform: translateX(100%);
        }
      }
    `
    const result = prefixSelectors(css, 'web-component-batata')
    expect(result).toBe(`
      @keyframes slidein {web-component-batata from {
          transform: translateX(0%);
        }web-component-batata to {
          transform: translateX(100%);
        }
      }
    `)
  })

  it('deve lidar com classes e ids corretamente', () => {
    const css = `
      #header {
        background: yellow;
      }
      .footer {
        padding: 10px;
      }
    `
    const result = prefixSelectors(css, 'web-component-batata')
    expect(result).toBe(`web-component-batata #header {
        background: yellow;
      }web-component-batata .footer {
        padding: 10px;
      }
    `)
  })
})
