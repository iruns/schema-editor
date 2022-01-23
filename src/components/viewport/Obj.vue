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
      v-text="objState.text"
    />
    <!-- @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave" -->
    <div v-if="subs" class="subs">
      <ObjV
        v-for="(el, eId) in subs"
        :key="eId"
        :elements="elements"
        :objId="eId"
        :state="el"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator'

import main from '@/store/modules/main'
import {
  IAnyEl,
  IInstance,
  IInstanceRoot,
  IObj,
  IRootEl,
} from '@/@types/base'

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
  @Prop({ type: Object, required: true })
  elements!: Record<string, IRootEl>

  @Prop({ type: String, required: true })
  objId!: string

  @Prop({ type: Object, required: true })
  state!: IAnyEl

  // Setup

  get type() {
    if (!(this.state as IInstance).ref) return 'obj'
    if ((this.state as IInstanceRoot).coords) return 'insR'
    return 'ins'
  }

  get objState() {
    if (this.type == 'obj') return this.state as IObj

    return this.elements[
      (this.state as IInstance).objRefId
    ] as IObj
  }

  get subs() {
    if (!this.state.subIds) return null

    const result: Record<string, IAnyEl> = {}
    for (const id in this.state.subIds) {
      const sub = this.state.subIds[id]
      // if referencing an obj, use the id, if an instance, use the instance id of the sub obj
      result[id] = this.elements[sub == 1 ? id : sub]
    }

    return result
  }

  mounted() {
    const state = this.state as IInstance

    // if instance create subs that don't have a state yet
    if (!state.ref) return

    const src = state.ref
    if (!src.subIds) return
    for (const id in src.subIds) {
      if (!state.subIds || !state.subIds[id]) {
        // if referencing an obj, use the id, if an instance, use the instance id of the sub obj
        const sub = src.subIds[id]
        main.addIns({
          parent: state,
          objRefId: id,
          ref: this.elements[sub == 1 ? id : sub],
        })
      }
    }
  }

  // TODO if ref is not found, delete own tree

  // Editing
  onBlur(e: FocusEvent) {
    main.setText({
      obj: this.objState,
      text: (e.target as any).innerText,
    })
  }

  get text() {
    return this.objState.text
  }

  set text(val: string | undefined) {
    main.setText({ obj: this.objState, text: val })
  }

  get style() {
    return Object.assign(
      { color: this.state.color || this.objState.color },
      main.objStyles[this.objState.level || 1]
    )
  }

  get coords() {
    const coords =
      this.type != 'insR'
        ? this.objState.coords
        : (this.state as IInstanceRoot).coords
    return {
      x: coords.x + 'px',
      y: coords.y + 'px',
    }
  }

  get isSelected() {
    return !!main.selection.els?.[this.state.id]
  }

  onMouseDown(e: MouseEvent) {
    onMouseDown({ e, elId: this.state.id })
  }

  onMouseEnter() {
    onMouseEnter(this.state.id)
  }
  onMouseLeave() {
    onMouseLeave(this.state.id)
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

  .subs {
    position: relative;
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
