import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: colors.cyan.base,
        secondary: colors.red.lighten2,
        accent: colors.deepOrange.lighten1,
      },
    },
  },
})
