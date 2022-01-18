import {
  VuexModule,
  Module,
  Mutation,
  getModule,
} from 'vuex-module-decorators'
import store from '..'

import Vue from 'vue'
import { cloneDeep } from 'lodash'

const name = 'uiMod'
if ((store as any).state[name]) store.unregisterModule(name)

export type SnackbarConfig = {
  text: string
  color?: string
  timeout: number
}

export type DialogConfig = {
  heading: string
  text?: string
  color?: string
  inputLabel?: string
  inputPrefill?: string
  inputRules?: ((input: string) => string | boolean)[]
  confirmText?: string
  onConfirm?: (input?: string) => void
}

@Module({
  name,
  namespaced: true,
  dynamic: true,
  store,
})
class UI extends VuexModule {
  snackbarConfigs: (SnackbarConfig | null)[] = []

  @Mutation public displaySnackbar(config: SnackbarConfig) {
    this.snackbarConfigs.push(cloneDeep(config))
  }
  @Mutation public hideSnackbar() {
    Vue.set(this.snackbarConfigs, 0, null)
  }
  @Mutation public removeSnackbar() {
    this.snackbarConfigs.shift()
  }

  dialog = false
  dialogConfig: DialogConfig = {
    heading: '',
  }
  @Mutation public displayDialog(config: DialogConfig) {
    Vue.set(this, 'dialogConfig', cloneDeep(config))
    this.dialog = true
  }
  @Mutation public hideDialog() {
    this.dialog = false
  }
}

export default getModule(UI)
