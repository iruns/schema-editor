<template>
  <div class="field number-input">
    <label>{{ label }}</label>
    <v-chip class="ma-2" close>
      Closable
    </v-chip>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator'

@Component
export default class NumberInput extends Vue {
  @Prop({ type: String, default: 'Label' })
  label!: string

  @Prop({ type: String, default: '0' })
  value!: string

  @Prop({ type: Number, default: 1 })
  nudge!: number

  nudgeValue(n: number) {
    this.$emit(
      'input',
      (parseInt(this.value) || 0) + n * this.nudge
    )
  }
}
</script>

<style lang="scss" scoped>
.field {
  .input-row {
    display: flex;
    background-color: whitesmoke;
    border-radius: 5px;
    width: fit-content;
    padding: 0.2em 0.4em;

    align-items: center;
    input {
      width: 40px;
    }
  }
}
</style>
