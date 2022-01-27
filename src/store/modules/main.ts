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
  IClone,
  ICloneRoot,
  IObj,
  Vec2,
  IRootEl,
} from '@/@types/base'
import {
  DragEventParams,
  MouseEventParams,
} from '@/utils/mouse'
import { Clone, Obj } from '@/classes/Els'
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

  @Mutation cloneChild({
    parent,
    ref,
  }: {
    parent: IClone
    ref: IAnyEl
  }) {
    if (!file.current) return

    const id = uniqueId('clone')
    const clone: IClone = new Clone({
      id,
      ref,
    })

    if (!parent.childIds) Vue.set(parent, 'childIds', {})
    Vue.set(parent.childIds!, clone.objRef.id, id)
    Vue.set(file.current.elements, id, clone)
  }
  @Mutation removeCloneChild({
    parent,
    refId,
  }: {
    parent: IClone
    refId?: string
  }) {
    if (!parent.childIds) return

    if (refId) Vue.delete(parent.childIds, refId)
    else Vue.delete(parent, 'childIds')
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

  // EDIT FIELDS
  @Mutation setVal({
    el,
    key,
    val,
  }: {
    el: IAnyEl
    key: string | number
    val?: any
  }) {
    Vue.set(el, key, val)
  }

  @Mutation setEndVal({
    clone,
    key,
    val,
  }: {
    clone: IClone
    key: string | number
    val: any
  }) {
    Vue.set(clone.endState, key, val)
  }

  // TODO to setSelectionVal, handle the various types here
  @Mutation setValsInGroups({
    groups,
    key,
    val,
  }: {
    groups: IAnyEl[][]
    key: string
    val: any
  }) {
    if (key !== 'coords') {
      // for (let i = 0; i < els.length; i++)
      //   Vue.set(els[i], key, val)
    } else {
      //
    }
  }

  // MOUSE

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
    // if (!file.current) return
    // const newObj = new Obj(e.clientX, e.clientY)
    // const id = uniqueId('ob')
    // // if there's a parent
    // // then add to root
    // Vue.set(file.current.elements, id, newObj)
  }

  //  selecting Els
  // TODO add selection parents
  selection: ElSelection = {
    els: null,
    links: null,

    objs: [],
    rootEls: [],

    clones: [],
    childClones: [],

    cloneObjRefs: [],
    rootCloneObjRefs: [],
    childCloneObjRefs: [],

    cloneEndStates: [],
  }
  @Mutation selectEl({
    newEls,
    add,
  }: {
    newEls?: string[]
    add?: boolean
  }) {
    const { selection } = this

    const {
      els,

      objs,
      rootEls,
      clones,
      childClones,

      cloneObjRefs,
      rootCloneObjRefs,
      childCloneObjRefs,

      cloneEndStates,
    } = selection

    objs.length = 0
    rootEls.length = 0

    clones.length = 0
    childClones.length = 0

    cloneObjRefs.length = 0
    rootCloneObjRefs.length = 0
    childCloneObjRefs.length = 0

    cloneEndStates.length = 0

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

      for (const id in els) {
        const el = file.current.elements[id]

        if (!(el as IClone).ref) {
          objs.push(el as IObj)
          rootEls.push(el as IRootEl)
        } else if ((el as IClone).ref) {
          clones.push(el as IClone)
          cloneObjRefs.push((el as IClone).objRef)
          cloneEndStates.push((el as IClone).endState)

          if ((el as ICloneRoot).isRoot) {
            rootEls.push(el as ICloneRoot)
            rootCloneObjRefs.push((el as ICloneRoot).objRef)
          } else {
            childClones.push(el as IClone)
            childCloneObjRefs.push((el as IClone).objRef)
          }
        }
      }
    }
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

      // if clone (not root clone)
      if (!(el as ICloneRoot).isRoot)
        movableEl = file.current.elements[
          (el as IClone).objRef.id
        ] as IObj

      movableEl.x += offset.x
      movableEl.y += offset.y
    }
  }
}

export default getModule(Main)
