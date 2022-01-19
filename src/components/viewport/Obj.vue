<template>
  <div
    :class="{ obj: true, selected: isSelected }"
    :style="{ left: coords.x, top: coords.y }"
  >
    <!-- v-if="!isEditingText" -->
    <p
      :class="{ text: true, selected: isSelected }"
      :style="style"
      @click.left.stop="onClick"
      @mousedown="onMouseDown"
    >
      {{ state.text || '-' }}
    </p>
    <!-- <input
      :class="{ text: true, selected: isSelected }"
      :style="style"
      v-model="state.text"
      placeholder="-"
      @click.left.stop="onClick"
      @mousedown="onMouseDown"
    />
    <span
      ref="input"
      class="input"
      role="textbox"
      contenteditable
    >
      {{ state.text }}
    </span> -->
    <!-- <span id="size-calibration"></span>
    <input id="autosized-input" /> -->
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator'

import content from '@/store/modules/content'
import { IObj } from '@/@types/base'

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

  inputEl!: Element
  mounted() {
    this.inputEl = this.$refs.input as Element
  }

  get text() {
    return this.state.text
  }

  set text(val: string | undefined) {
    content.setText({ obj: this.state, text: val })
  }

  get style() {
    return content.objStyles[this.state.style || 'default']
  }

  get coords() {
    return {
      x: this.state.coords.x + 'px',
      y: this.state.coords.y + 'px',
    }
  }

  get isSelected() {
    return !!content.selection.els?.[this.id]
  }

  isEditingText = false
  @Watch('isSelected')
  onSelect(val: boolean) {
    if (!val) {
      this.isEditingText = false
      // content.setText({
      //   obj: this.state,
      //   text: this.inputEl.innerHTML,
      // })
    }
  }

  onClick(e: MouseEvent) {
    if (!e.altKey && !this.isDragging) {
      if (!this.isSelected || e.shiftKey)
        content.selectEl({
          newEls: { [this.id]: true },
          add: e.shiftKey ? true : false,
        })
      else {
        this.isEditingText = true
      }
    }
  }

  mouseTimer: number | undefined
  isDragging = false
  onMouseDown(e: MouseEvent) {
    // if not selected yet, select
    if (!this.isSelected && !e.altKey)
      content.selectEl({
        newEls: { [this.id]: true },
        add: e.shiftKey ? true : false,
      })

    content.startDrag(e)

    // add delays to differentiate between clicks and drags
    clearTimeout(this.mouseTimer)
    this.mouseTimer = setTimeout(() => {
      this.isDragging = true
    }, 500) as any

    window.addEventListener('mouseup', () => {
      clearTimeout(this.mouseTimer)
      delete this.mouseTimer

      setTimeout(() => {
        this.isDragging = false
      }, 1)
    })
  }
}
</script>

<style lang="scss">
.obj {
  position: absolute;
  pointer-events: all;
  padding: 5px;

  .text {
    position: relative;
    cursor: pointer;
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
// TODO use this to auto size the input according to the span
// #relative-parent {
//     position: relative;
//     min-width: 1em;
//     width: min-content;
//   }

//   #size-calibration {
//     visibility: hidden;
//     /* Prevent the span from wrapping the text when input value has multiple words, or collapsing multiple spaces into one */
//     white-space: pre;
//   }

//   #autosized-input {
//     position: absolute;
//     left: 0;
//     width: 100%;
//   }

//   #size-calibration, #autosized-input {
//     /* Normalize styles that the browser sets differently between spans and inputs.
//     Ideally, use a "CSS reset" here. */
//     font-family: "Arial";
//     padding: 0;
//     /* Demonstrate that this works for input with custom styles */
//     font-size: 24px;
//   }
</style>
