import { createPinia } from 'pinia'
import HelloWorld from './components/HelloWorld.vue'

import { defineCustomElement } from 'vue'
import { useDynamicStyle } from './plugins/useDynamicStyle'
import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'
import { SliderElement } from '@vueform/vueform/dist/vueform'
import TikTok from './components/TikTok/TikTok.vue'

const components = [
  {
    name: 'visualizer-tik-tok',
    component: TikTok,
    shadowRoot: false
  }
]

components.forEach(({ component, name, shadowRoot }) => {
  const ce = defineCustomElement(component, {
    configureApp(app) {
      app.use(createPinia())
      if (!shadowRoot) app.use(useDynamicStyle(name))
      app.use(Vueform, {
        ...vueformConfig,
        components: {
          SliderElement
        }
      })
    },
    shadowRoot
  })

  customElements.define(name, ce)
})
