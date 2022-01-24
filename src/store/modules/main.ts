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
  IAnyEl,
  IEl,
  IInstance,
  IInstanceRoot,
  IObj,
  Vec2,
} from '@/@types/base'
import {
  DragEventParams,
  MouseEventParams,
} from '@/utils/mouse'
import { Obj } from '@/classes/Els'
import { uniqueId } from 'lodash'

const name = 'main'
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
class Main extends VuexModule {
  zoomLevel = 1
  @Mutation setZoomLevel(val: number) {
    this.zoomLevel = val
  }

  @Mutation setRefHidden(insState: IInstance) {
    let val = true

    // if the refState is not set yet, set
    if (!insState.refState)
      Vue.set(insState, 'refState', {})

    const ref = insState.ref
    // if ref is Obj, set from it
    if (!(ref as IInstance).ref) val = ref.hidden || false
    // if ref is another instance, set from it's hidden or refHidden
    else
      val =
        ref.hidden ||
        (ref as IInstance).refState?.hidden ||
        false

    Vue.set(insState.refState!, 'hidden', val)
  }

  @Mutation addIns({
    parent,
    objRefId,
    ref,
  }: {
    parent: IInstance
    objRefId: string
    ref: IAnyEl
  }) {
    if (!file.current) return

    const id = uniqueId('ins')
    const ins: IInstance = {
      ref,
      objRefId,
      id,
    }

    if (!parent.subIds) Vue.set(parent, 'subIds', {})
    Vue.set(parent.subIds!, objRefId, id)
    Vue.set(file.current.elements, id, ins)
  }

  @Action getLocalCoords({
    clientX,
    clientY,
    parentObj,
  }: {
    clientX: number
    clientY: number
    parentObj?: string
  }) {
    // get parent el or the root reference el
    // return the offset
  }

  get objStyles() {
    const result: Record<string, any>[] = []

    for (let l = 0; l < objSizes.length; l++) {
      const style = (result[l] = {} as any)

      style['font-size'] = objSizes[l]

      if (l <= 1) style['font-weight'] = 'bold'
    }

    return result
  }

  hiddenOpacity = 0.1

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

  // add/remove Els
  @Mutation addObj({ e, elId }: MouseEventParams) {
    if (!file.current) return

    const newObj = new Obj(e.clientX, e.clientY)
    const id = uniqueId('ob')

    // if there's a parent

    // then add to root
    Vue.set(file.current.elements, id, newObj)
  }

  //  selecting Els
  selection: ElSelection = {
    els: null,
    links: null,
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
      const newElsObj: Record<string, 1> = {}
      if (newElsObj)
        for (let e = 0; e < newEls.length; e++)
          newElsObj[newEls[e]] = 1

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

  //  dragging selected Els
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
      const el = file.current.elements[id]
      let movableEl = el as IObj

      // if instance (not root instance)
      if (!(el as IInstanceRoot).coords)
        movableEl = file.current.elements[
          (el as IInstance).objRefId
        ] as IObj

      movableEl.coords.x += offset.x
      movableEl.coords.y += offset.y
    }
  }
}

export default getModule(Main)
