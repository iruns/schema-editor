<template>
  <div
    :class="{ obj: true, selected: isSelected }"
    :style="{ left: coords.x, top: coords.y }"
  >
    <span
      role="textbox"
      :contenteditable="isSelected"
      :class="{ text: true, selected: isSelected }"
      :style="style"
      @mousedown.left.stop="onMouseDown"
      @blur="onBlur"
      v-text="state.text"
    />
    <!-- @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave" -->
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator'

import viewport from '@/store/modules/viewport'
import { IObj } from '@/@types/base'

import {
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
} from '@/utils/mouse'

@Component({
  components: {
    //
  },
})
export default class ObjV extends Vue {
  @Prop({ type: String, required: true })
  id!: string

  @Prop({ type: Object, required: true })
  state!: IObj

  onBlur(e: FocusEvent) {
    viewport.setText({
      obj: this.state,
      text: (e.target as any).innerText,
    })
  }

  get text() {
    return this.state.text
  }

  set text(val: string | undefined) {
    viewport.setText({ obj: this.state, text: val })
  }

  get style() {
    return viewport.objStyles[this.state.style || 'default']
  }

  get coords() {
    return {
      x: this.state.coords.x + 'px',
      y: this.state.coords.y + 'px',
    }
  }

  get isSelected() {
    return !!viewport.selection.els?.[this.id]
  }

  mouseTimer: number | undefined
  isDragging = false
  onMouseDown(e: MouseEvent) {
    onMouseDown({ e, elId: this.id })
  }

  onMouseEnter() {
    onMouseEnter(this.id)
  }
  onMouseLeave() {
    onMouseLeave(this.id)
  }
}
</script>

<style lang="scss">
.obj {
  position: absolute;
  pointer-events: all;
  padding: 10px;

  .text {
    position: relative;
    cursor: pointer;
    white-space: pre;
    margin: 0;
  }
}
.obj,
.obj .text {
  border: 2px transparent solid;
  &:hover {
    border: 2px rgba(0, 0, 0, 0.2) solid;
  }
  &.selected:after {
    pointer-events: none;
    border: 1px black dashed;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
