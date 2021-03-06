<template>
  <div
    tabindex="0"
    class="view-controller"
    ref="root"
    :style="{
      'background-color': backgroundColor,
    }"
    @mousedown.ctrl.exact.self="startPan"
    @mousedown.right.exact.self="startPan"
    @mousewheel.exact.prevent="shift"
    @mousewheel.ctrl.prevent="zoom"
  >
    <div
      class="inner"
      :style="{
        left: zoomContainerX + 'px',
        top: zoomContainerY + 'px',
        transform: `scale(${zoomLevel})`,
        'pointer-events': ctrlIsDown ? 'none' : 'all',
      }"
    >
      <div
        class="inner"
        :style="{
          left: offsetX + zoomContentX + 'px',
          top: offsetY + zoomContentY + 'px',
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vec2 } from '@/@types/base'
import {
  Component,
  Vue,
  Prop,
} from 'vue-property-decorator'

@Component
export default class ViewController extends Vue {
  @Prop({ type: Number, default: 1 })
  initialZoom!: number

  @Prop({ type: Function })
  onZoom?: (zoomLevel: number) => {}

  @Prop({ type: String, default: 'whitesmoke' })
  backgroundColor!: string

  width = 0
  height = 0

  offsetX = 0
  offsetY = 0

  mounted() {
    const rect = (this.$refs
      .root as Element).getBoundingClientRect()

    this.width = rect.width
    this.height = rect.height

    this.offsetX = this.width * 0.1
    this.offsetY = this.height * 0.1

    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)

    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', this.pan)
    })
    window.addEventListener('mouseleave', () => {
      window.removeEventListener('mousemove', this.pan)
    })

    this.zoom({
      layerX: this.offsetX,
      layerY: 0,
      zoomLevel: this.initialZoom,
    })

    if (this.onZoom) this.onZoom(this.zoomLevel)
  }

  startingX = 0
  startingY = 0

  startingMouseX = 0
  startingMouseY = 0

  ctrlIsDown = false
  keyDown(e: KeyboardEvent) {
    if (e.key == 'Control') this.ctrlIsDown = true

    if (!e.altKey) {
      if (e.ctrlKey) {
        const ze = {
          deltaY: 1,
          layerX: this.width / 2,
          layerY: this.height / 2,
        }
        switch (e.key) {
          case 'ArrowDown':
            this.zoom(ze)
            break
          case 'ArrowUp':
            ze.deltaY *= -1
            this.zoom(ze)
            break
        }
      }
    }
  }
  keyUp(e: KeyboardEvent) {
    if (e.key == 'Control') this.ctrlIsDown = false
  }

  startPan(e: MouseEvent) {
    this.startingX = this.offsetX
    this.startingY = this.offsetY

    this.startingMouseX = e.clientX
    this.startingMouseY = e.clientY

    window.addEventListener('mousemove', this.pan)
  }

  pan(e: MouseEvent) {
    this.offsetX =
      this.startingX +
      (e.clientX - this.startingMouseX) / this.zoomLevel
    this.offsetY =
      this.startingY +
      (e.clientY - this.startingMouseY) / this.zoomLevel
  }

  shift(e: WheelEvent) {
    if (e.deltaX) this.offsetX -= e.deltaX / this.zoomLevel
    if (e.deltaY) this.offsetY -= e.deltaY / this.zoomLevel
  }

  zoomContainerX = 0
  zoomContainerY = 0
  zoomContentX = 0
  zoomContentY = 0
  zoomLevel = 1

  zoom(e: any) {
    this.zoomContentX +=
      (this.zoomContainerX - e.layerX) / this.zoomLevel
    this.zoomContentY +=
      (this.zoomContainerY - e.layerY) / this.zoomLevel

    this.zoomContainerX = e.layerX
    this.zoomContainerY = e.layerY

    if (e.zoomLevel) this.zoomLevel = e.zoomLevel
    else if (e.deltaY < 0) this.zoomLevel *= 1.05
    else if (e.deltaY > 0) this.zoomLevel /= 1.05

    if (this.onZoom) this.onZoom(this.zoomLevel)
  }
}
</script>

<style lang="scss">
.view-controller {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  .inner {
    position: absolute;
    transition: all 100ms;
  }
}
</style>
