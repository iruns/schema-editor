<template>
  <div class="field number-input">
    <label>{{ label }}</label>
    <div class="input-row">
      <input
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
      <v-btn
        class="btn"
        icon
        x-small
        @click="nudgeValue(-1)"
      >
        <v-icon small>
          mdi-minus-circle-outline
        </v-icon>
      </v-btn>
      <v-btn
        class="btn"
        icon
        x-small
        @click="nudgeValue(1)"
      >
        <v-icon small>
          mdi-plus-circle-outline
        </v-icon>
      </v-btn>
    </div>
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
