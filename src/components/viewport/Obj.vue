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
    <div v-if="children" class="children">
      <ObjV
        v-for="(el, eId) in children"
        :key="eId"
        :elements="elements"
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
  IClone,
  ICloneRoot,
  IElVars,
  IObj,
  IRootEl,
} from '@/@types/base'

import {
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
} from '@/utils/mouse'

// TODO watch ref to update EndState

@Component({
  components: {
    //
  },
})
export default class ObjV extends Vue {
  @Prop({ type: Object, required: true })
  elements!: Record<string, IRootEl>

  @Prop({ type: Object, required: true })
  state!: IAnyEl

  // Setup

  get type() {
    if (!(this.state as IClone).ref) return 'obj'
    if ((this.state as ICloneRoot).isRoot)
      return 'cloneRoot'
    return 'clone'
  }

  get objState() {
    if (this.type == 'obj') return this.state as IObj
    return (this.state as IClone).objRef
  }

  get children() {
    if (!this.state.childIds) return null

    const result: Record<string, IAnyEl> = {}
    for (const id in this.state.childIds) {
      const sub = this.state.childIds[id]
      // if referencing an obj, use the id, if a clone, use the clone id of the sub obj
      result[id] = this.elements[sub == 1 ? id : sub]
    }

    return result
  }

  // Own or Obj vars
  //  text
  get text() {
    return this.objState.text
  }
  set text(val: string | undefined) {
    main.setVal({ el: this.objState, key: 'text', val })
  }
  onBlur(e: FocusEvent) {
    this.text = (e.target as any).innerText
  }

  get level() {
    return this.objState.level
  }

  get coords() {
    let rootEl: IRootEl | undefined

    switch (this.type) {
      case 'clone':
        rootEl = (this.state as IClone).objRef
        break
      default:
        rootEl = this.state as ICloneRoot
    }

    return {
      x: (rootEl?.x || 0) + 'px',
      y: (rootEl?.y || 0) + 'px',
    }
  }

  // endState
  get refEndState() {
    if (this.type == 'obj') return null

    const src = (this.state as IClone).ref
    if ((src as IClone).ref) return (src as IClone).endState
    return src as IElVars
  }
  get endState() {
    if (this.type == 'obj') return this.state as IObj
    else return (this.state as IClone).endState
  }

  get hidden() {
    // if a clone, check if endState should be updated
    if (this.type == 'clone') this.updateEndVal('hidden')

    // then return the endState
    return this.endState.hidden
  }

  get color() {
    // if a clone, check if endState should be updated
    if (this.type == 'clone') this.updateEndVal('color')

    // then return the endState
    return this.endState.color
  }

  updateEndVal(key: keyof IElVars) {
    const newVal =
      this.state[key] || this.refEndState?.[key]

    if (newVal != this.endState[key])
      main.setEndVal({
        clone: this.state as IClone,
        key,
        val: newVal,
      })

    return newVal
  }

  get style() {
    const result: any = Object.assign(
      { color: this.state.color || this.objState.color },
      main.objStyles[this.objState.level || 1]
    )

    if (this.hidden) result.opacity = main.hiddenOpacity

    return result
  }

  // if clone, match the children to ref
  @Watch('state.objRef.childIds', { immediate: true })
  onRefChildIds(refChildIds?: Record<string, 1>) {
    const state = this.state as IClone
    if (!state.ref) return

    // if the ref has children
    if (refChildIds) {
      // create children that don't have a state yet
      for (const id in refChildIds) {
        if (!state.childIds || !state.childIds[id]) {
          // if referencing an obj, use the id,
          // else if a clone, use the clone id of the sub obj
          const sub = refChildIds[id]
          main.cloneChild({
            parent: state,
            ref: this.elements[sub == 1 ? id : sub],
          })
        }
      }

      // remove children that don't exist in the ref anymore
      for (const id in state.childIds) {
        if (!refChildIds || !refChildIds[id]) {
          main.removeCloneChild({
            parent: state,
            refId: id,
          })
        }
      }
    }
    // else, remove own childIds
    else
      main.removeCloneChild({
        parent: state,
      })
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

  .children {
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
