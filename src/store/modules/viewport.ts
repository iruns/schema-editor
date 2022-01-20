import {
  VuexModule,
  Module,
  Mutation,
  getModule,
  Action,
} from 'vuex-module-decorators'
import store from '..'

import Vue from 'vue'
import file from './file'

import {
  ElSelection,
  ElType,
  IEl,
  IObj,
  Vec2,
} from '@/@types/base'
import {
  DragEventParams,
  MouseEventParams,
} from '@/utils/mouse'

const name = 'viewport'
if ((store as any).state[name]) store.unregisterModule(name)

const objSizes: string[] = []
let lastSize = 10
for (let l = 0; l < 5; l++) {
  objSizes.unshift(lastSize + 'px')
  lastSize = Math.ceil(lastSize * 1.5)
}

@Module({
  name,
  namespaced: true,
  dynamic: true,
  store,
})
class Viewport extends VuexModule {
  zoomLevel = 1
  @Mutation setZoomLevel(val: number) {
    this.zoomLevel = val
  }

  get objStyles() {
    const result: Record<string, Record<string, any>> = {}

    if (file.current) {
      const { objStyles } = file.current

      for (const name in objStyles) {
        const objStyle = objStyles[name]
        const style = (result[name] = {} as any)

        style['font-size'] = objSizes[objStyle.level]

        if (objStyle.color) style.color = objStyle.color

        if (objStyle.level <= 1)
          style['font-weight'] = 'bold'
      }
    }

    return result
  }

  @Mutation setText({
    obj,
    text,
  }: {
    obj: IObj
    text?: string
  }) {
    obj.text = text
  }

  // Raw mouse event handling and distribution
  @Action onClick({ e, elId }: MouseEventParams) {
    if (!e.altKey)
      this.selectEl({
        newEls: elId ? [elId] : undefined,
        add: e.shiftKey,
      })
  }
  @Action onDoubleClick({ e, elId }: MouseEventParams) {
    console.log('dClick', elId)
  }
  @Action onDragStart({ e, elId }: MouseEventParams) {
    const selected = this.selection.els
    // if alt is pressed
    if (e.altKey) {
      // if there's selection, drag the selected els
      if (selected) this.startDraggingSelection()
    }
    // else
    else {
      // if there's no new selection
      if (!elId || !elId.length) {
        // start selection rect
      }
      // else
      else {
        // if new selection is not selected yet, switch selection to it
        if (!selected || !selected[elId])
          this.selectEl({ newEls: [elId] })
        // then drag the selected els
        this.startDraggingSelection()
      }
    }
  }
  @Action onDrag({ e, offset }: DragEventParams) {
    if (this.isDraggingSelection) this.dragSelection(offset)
  }
  @Action onDragEnd({ e, elId }: MouseEventParams) {
    if (this.isDraggingSelection) this.endDraggingSelection
  }

  // Specific mouse even handling

  //  selecting els
  selection: ElSelection = {
    els: null,
  }
  @Mutation selectEl({
    newEls,
    add,
  }: {
    newEls?: string[]
    add?: boolean
  }) {
    const { selection } = this

    // const s0 = Object.keys(selection.els || {})

    // if not selecting > empty
    if (!newEls || !newEls.length) {
      if (selection.els) Vue.set(selection, 'els', null)
    }
    // else
    else {
      // create newElsObj
      const newElsObj: Record<string, true> = {}
      if (newElsObj)
        for (let e = 0; e < newEls.length; e++)
          newElsObj[newEls[e]] = true

      // if empty > select
      if (!selection.els)
        Vue.set(selection, 'els', newElsObj)
      // if filled
      else {
        const olds = Object.keys(selection.els)
        // new is single & exactly the same
        if (
          newEls.length == 1 &&
          olds.length == 1 &&
          newEls[0] == olds[0]
        ) {
          // adding > deselect
          if (add) Vue.set(selection, 'els', null)
          // not adding > pass
        } else {
          // not adding > replace selection
          if (!add) Vue.set(selection, 'els', newElsObj)
          // adding
          if (add) {
            // new is single & already selected > deselect
            if (
              newEls.length == 1 &&
              !!selection.els[newEls[0]]
            )
              Vue.delete(selection.els, newEls[0])
            // else if new single & different OR new is multiple > add to selection
            else
              Vue.set(
                selection,
                'els',
                Object.assign(newElsObj, selection.els)
              )
          }
          // TODO filter out selection to remove subs of selected
        }
      }
    }
    // console.log(
    //   newEls,
    //   add,
    //   s0,
    //   '>',
    //   Object.keys(selection.els || {})
    // )
  }

  //  dragging selected els
  isDraggingSelection = false
  @Mutation startDraggingSelection() {
    this.isDraggingSelection = true
  }
  @Mutation endDraggingSelection() {
    this.isDraggingSelection = false
  }
  @Mutation dragSelection(offset: Vec2) {
    if (!file.current) return

    offset.x /= this.zoomLevel
    offset.y /= this.zoomLevel

    for (const id in this.selection.els) {
      const el = file.current.els[id]
      if (!el || el.type != ElType.OBJ) continue

      el.coords.x += offset.x
      el.coords.y += offset.y
    }
  }
}

export default getModule(Viewport)
