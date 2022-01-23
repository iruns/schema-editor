<template>
  <g class="edge-line">
    <path
      :class="{
        'val-edge-line animated': true,
        negative: width < 0,
      }"
      :d="d"
      :stroke-width="strokeWidth"
      :stroke="color"
      :opacity="strokeOpacity"
    />
  </g>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
} from 'vue-property-decorator'
import { Vec2 } from '@/@types/base'
import { lerp } from '@/utils/math'

@Component
export default class EdgeLine extends Vue {
  @Prop({ type: Object, required: true })
  coords0!: Vec2

  @Prop({ type: Object, required: true })
  coords1!: Vec2

  @Prop({ type: String, default: 'black' })
  color!: string

  @Prop({ type: Number, default: 1 })
  width!: number

  @Prop({ type: Number, default: 1 })
  opacity!: number

  minWidth = 1
  maxWidth = 3

  get strokeWidth() {
    return lerp(
      this.minWidth,
      this.maxWidth,
      this.width ** 0.5
    )
  }

  minOpacity = 0.1

  get strokeOpacity() {
    return lerp(this.minOpacity, 1, this.opacity ** 0.5)
  }

  get d() {
    const { coords0, coords1 } = this

    return (
      'M ' +
      coords0.x +
      ' ' +
      (coords0.y + 10) +
      ' q ' +
      (coords1.x - coords0.x) / 2 +
      ' ' +
      ((coords1.y - coords0.y) / 2 - 25) +
      ' ' +
      (coords1.x - coords0.x) +
      ' ' +
      (coords1.y - coords0.y - 20)
    )
  }

  created() {
    //
  }
}
</script>

<style lang="scss">
.val-edge-line {
  fill: none;
  &.negative {
    stroke-dasharray: 5 5;
  }
}
</style>
