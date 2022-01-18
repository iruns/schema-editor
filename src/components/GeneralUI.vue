<template>
  <div>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 lighten-2">
          {{ dialogConfig.heading }}
        </v-card-title>

        <v-card-text>
          <div v-html="dialogConfig.text" />
          <v-text-field
            v-if="dialogConfig.inputLabel"
            :label="dialogConfig.inputLabel"
            :rules="dialogConfig.inputRules"
            v-model="inputVal"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="dialogConfig.onConfirm"
            color="grey darken-2"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            :color="dialogConfig.color || 'primary'"
            text
            @click="onConfirmClick"
          >
            {{ dialogConfig.confirmText || 'Okay' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      top
      :color="snackbarConfig.color"
      :timeout="snackbarConfig.timeout"
    >
      {{ snackbarConfig.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch,
} from 'vue-property-decorator'

import uiMod, {
  SnackbarConfig,
} from '@/store/modules/ui'

type MenuItem = {
  text: string
  icon: string
  color?: string
  func: () => void
}

@Component
export default class GeneralUI extends Vue {
  // dialog
  get dialog() {
    return uiMod.dialog
  }
  set dialog(val: boolean) {
    if (!val) uiMod.hideDialog()
  }
  get dialogConfig() {
    return uiMod.dialogConfig
  }

  inputVal = ''
  @Watch('dialog')
  onDialog(val: boolean, prevVal: boolean) {
    if (val && !prevVal) {
      const { dialogConfig } = this
      // set or empty dialog input
      if (dialogConfig.inputPrefill)
        this.inputVal = dialogConfig.inputPrefill
      else this.inputVal = ''
    }
  }
  // TODO disable if input is not valid

  onConfirmClick() {
    if (this.dialogConfig.onConfirm)
      this.dialogConfig.onConfirm(this.inputVal)

    this.dialog = false
  }

  // snackbar
  get snackbar() {
    return !!uiMod.snackbarConfigs[0]
  }

  set snackbar(val: boolean) {
    if (!val) {
      uiMod.hideSnackbar()
      setTimeout(uiMod.removeSnackbar, 250)
    }
  }

  snackbarConfig: SnackbarConfig = {
    text: '',
    timeout: 1000,
  }
  @Watch('snackbar', { immediate: true })
  onSnackbarChange(val: boolean, oldVal: boolean) {
    if (val && !oldVal)
      this.snackbarConfig = uiMod.snackbarConfigs[0]!
  }
}
</script>
