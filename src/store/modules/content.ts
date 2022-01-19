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
  IObj,
  Vec2,
} from '@/@types/base'

const name = 'content'
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
class Content extends VuexModule {
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

  selection: ElSelection = {
    els: null,
  }

  @Mutation selectEl({
    newEls,
    add,
  }: {
    newEls?: Record<string, true>
    add?: boolean
  }) {
    const { selection } = this

    // if not selecting > empty
    if (!newEls || !Object.keys(newEls).length) {
      if (selection.els) Vue.set(selection, 'els', null)
    }
    // else
    else {
      // if empty > select
      if (!selection.els) Vue.set(selection, 'els', newEls)
      // if filled
      else {
        const olds = Object.keys(selection.els)
        const news = Object.keys(newEls)
        // new is single & exactly the same
        if (
          news.length == 1 &&
          olds.length == 1 &&
          news[0] == olds[0]
        ) {
          // adding > deselect
          if (add) Vue.set(selection, 'els', null)
          // not adding > pass
        } else {
          // not adding > replace selection
          if (!add) Vue.set(selection, 'els', newEls)
          // adding
          if (add) {
            // new is single & already selected > deselect
            if (
              news.length == 1 &&
              !!selection.els[news[0]]
            )
              Vue.delete(selection.els, news[0])
            // else if new single & different OR new is multiple > add to selection
            else
              Vue.set(
                selection,
                'els',
                Object.assign(newEls, selection.els)
              )
          }
          // TODO filter out selection to remove subs of selected
        }
      }
    }
  }

  movingObjs = true
  prev = new Vec2()
  @Action startDrag(e: MouseEvent) {
    this.prev.x = e.clientX / this.zoomLevel
    this.prev.y = e.clientY / this.zoomLevel

    window.addEventListener('mousemove', this.drag)
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', this.drag)
    })
  }

  offset = new Vec2()
  @Action private drag(e: MouseEvent) {
    const clientX = e.clientX / this.zoomLevel
    const clientY = e.clientY / this.zoomLevel

    if (this.movingObjs) {
      this.offset.x = clientX - this.prev.x
      this.offset.y = clientY - this.prev.y
      this.moveObj(this.offset)

      this.prev.x = clientX
      this.prev.y = clientY
    }
  }

  @Mutation moveObj(offset: Vec2) {
    if (!this.selection.els) return
    if (!file.current) return

    for (const id in this.selection.els) {
      const el = file.current.els[id]
      if (!el || el.type != ElType.OBJ) continue

      el.coords.x += offset.x
      el.coords.y += offset.y
    }
  }
}

export default getModule(Content)
