<template>
  <div class="details pt-4 pl-4 pr-8">
    <small class="overview">
      {{ selectionOverview }}
    </small>
    <!-- File -->
    <!--    colors -->

    <!-- All -->
    <!--    color -->
    <!-- chips -->

    <!-- Element -->
    <!--    level -->
    <div class="field" v-if="fields.text">
      <label>Text</label>
      <input
        v-model="values.text.val"
        placeholder="edit me"
      />
      <v-btn icon small>
        <v-icon small>
          mdi-minus-circle-outline
        </v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon small>
          mdi-plus-circle-outline
        </v-icon>
      </v-btn>
    </div>
    <!--    hide -->
    <v-checkbox v-if="fields.hide" :label="'Hide'" />
    <!--    coords -->
    <!-- Two numbers -->
    <!--    parent -->
    <!-- One El selector (chip + setter) -->
    <v-chip class="ma-2" close>
      Closable
    </v-chip>
    <!--    children -->
    <!-- Several El selectors -->
    <!--    links -->
    <!-- Several pairs of El selectors -->

    <!-- Obj -->

    <!-- Instance -->
    <!--    ref -->
    <!-- One El selector -->

    <!-- Link -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import main from '@/store/modules/main'
import file from '@/store/modules/file'
import {
  IAnyEl,
  ICloneRoot,
  IFile,
  IObj,
  Vec2,
} from '@/@types/base'

type Button = {
  tooltip: string
  icon: string
  color?: string
  func?: () => void
  disabled?: boolean
}

type FieldKey = keyof IFile | keyof IObj | keyof ICloneRoot
type Fields = Partial<Record<FieldKey, 1>>

type ValueObj = {
  // if includes clones (not root) with set val, add UNSET
  // if no val is set, show as semi transparent
  valIsSet: boolean
  val: any
}

@Component
export default class Details extends Vue {
  get selection() {
    return main.selection
  }
  get selectedEls() {
    return this.selection.els
  }
  get selectedLinks() {
    return this.selection.links
  }

  get file() {
    return file.current
  }

  fieldgetGroups: Record<string, Fields> = {
    file: {
      // levels: 1,
      colors: 1,
    },
    all: {
      color: 1,
    },
    el: {
      level: 1,
      hidden: 1,

      x: 1,
      y: 1,

      parentId: 1,
    },
    obj: {
      //
    },
    clone: {
      ref: 1,
    },
    link: {
      // - thickness
      // - dashes
      // - arrow to
      // - arrow back
      // - target
    },
  }

  get selectionOverview() {
    if (
      !this.selection.objs.length &&
      !this.selection.clones.length
    )
      return 'file name'

    const result: string[] = []
    if (this.selection.objs.length)
      result.push(`${this.selection.objs.length} objs`)
    if (this.selection.clones.length)
      result.push(`${this.selection.clones.length} clones`)

    return result.join(' + ') + ' selected'
  }

  get fields() {
    const { fieldgetGroups } = this
    const result: Fields = {}

    if (!this.file) return result

    // if nothing is selected, display the global details
    if (!this.selectedEls && !this.selectedLinks) {
      // for (const field in fieldgetGroups.file)
      //   result[field] = 1
    }
    // else, if any is selected,
    else {
      let key: FieldKey
      for (key in fieldgetGroups.all) result[key] = 1

      // if only Elements
      if (!this.selectedLinks) {
        for (key in fieldgetGroups.el) result[key] = 1

        // if only one type, display the fields of that type
        if (!this.objs || !this.clones)
          for (key in fieldgetGroups[
            this.objs ? 'obj' : 'clone'
          ])
            result[key] = 1
      }
      // if only Links
      if (!this.selectedEls)
        for (key in fieldgetGroups.link) result[key] = 1
    }

    return result
  }

  get values() {
    const { fields } = this

    const {
      objs,
      rootEls,
      clones,
      childClones,

      cloneObjRefs,
      rootCloneObjRefs,
      childCloneObjRefs,

      cloneEndStates,
    } = this.selection

    const result: Partial<Record<FieldKey, ValueObj>> = {}

    const nSelecteds = objs.length + clones.length
    if (!nSelecteds) {
      // file fields
      // colors
      return result
    }

    // single
    //  parent
    // multiple
    // still use val and endVal

    // FILE

    // ALL
    // color
    //  if different, empty

    // LEVEL
    // hidden
    //  if different, empty
    // coords
    //  (OBJ / INROOT)
    //  empty different axes
    // parent
    //  (OBJ / INROOT)
    //  if multiple parents, empty
    // link
    //  if multiple objs (or refs), empty

    // INSTANCE
    // ref
    //  if more than 1 refs, empty

    // if field exists in refEndState
    //  if field is set in state, opacity 1
    //  else get from refEndState, opacity 0.6

    if (fields.x) {
      result.x = this.createValObj('x', [rootEls, chi])

      let valIsSet = !!objs.length
      if (!valIsSet)
        for (let i = 0; i < clones.length; i++) {
          if ((clones[i] as ICloneRoot).coords) {
            valIsSet = true
            break
          }
        }

      result.coords = {
        valIsSet,
        get val() {
          const val: Partial<Vec2> = {}

          let sameX = true,
            sameY = true

          for (let i = 0; i < rootEls.length; i++) {
            const coords = rootEls[i].coords

            if (sameX) {
              sameX = intersectVal(coords.x, val.x)
              if (sameX) val.x = coords.x
            }

            if (sameY) {
              sameY = intersectVal(coords.y, val.y)
              if (sameY) val.y = coords.y
            }

            if (!sameX && !sameY) break
          }

          if (sameX || sameY) {
            for (let i = 0; i < childClones.length; i++) {
              const coords = childClones[i].objRef.coords

              if (sameX) {
                sameX = intersectVal(coords.x, val.x)
                if (sameX) val.x = coords.x
              }

              if (sameY) {
                sameY = intersectVal(coords.y, val.y)
                if (sameY) val.y = coords.y
              }

              if (!sameX && !sameY) break
            }
          }

          return val
        },
        set val(val: Partial<Vec2>) {
          main.setValsIngetGroups({
            key: 'text',
            val,
          })
        },
      }
    }

    // parent
    if (fields.parentId) {
      // if the only selection are root elements
      if (nSelecteds == rootEls.length) {
        result.parentId = {
          valIsSet: true,
          get val() {
            let same = true
            let parentId: string | undefined = undefined

            for (let i = 0; i < rootEls.length; i++) {
              if (same) {
                same = intersectVal(
                  rootEls[i].parentId,
                  parentId
                )
                if (same) parentId = rootEls[i].parentId
              }
              if (!same) break
            }
            return rootEls[0].parentId
          },
          set val(val: string | undefined) {
            main.setValsIngetGroups({
              key: 'parentId',
              val,
            })
          },
        }
      }
    }

    // ref
    if (fields.parentId) {
      // if the only selection are clones
      if (nSelecteds == clones.length) {
        result.ref = {
          valIsSet: true,
          get val() {
            let same = true
            let parentId: string | undefined = undefined

            for (let i = 0; i < clones.length; i++) {
              if (same) {
                same = intersectVal(
                  rootEls[i].parentId,
                  parentId
                )
                if (same) parentId = rootEls[i].parentId
              }
              if (!same) break
            }
            return rootEls[0].parentId
          },
          set val(val: string | undefined) {
            main.setValsIngetGroups({
              key: 'parentId',
              val,
            })
          },
        }
      }
    }

    // hidden
    // color
    // level (only if exactly the same)
    return result
  }

  createValObj(
    key: FieldKey,
    getGroups: IAnyEl[][],
    setGroups?: IAnyEl[][]
  ) {
    let endVal: any = undefined

    const result: ValueObj = {
      valIsSet: true,
      get val() {
        let same = true

        for (let g = 0; g < getGroups.length; g++) {
          const group = getGroups[g]

          for (let i = 0; i < group.length; i++) {
            const val = (group[i] as any)[key]

            if (result == undefined) endVal = val
            else if (result != val) {
              same = false
              endVal = undefined
              break
            }
          }
          if (!same) break
        }

        return endVal
      },
      set val(val: string | undefined) {
        main.setValsInGroups({
          groups: setGroups || getGroups,
          key,
          val,
        })
      },
    }

    // if endVal was NOT set from getGroups, conclude that val IS NOT set
    if (endVal == undefined) result.valIsSet
    else {
      // if set setGroups is supplied
      // check if it is also set on any in the setGroups
      if (setGroups) {
        result.valIsSet = false

        for (let g = 0; g < setGroups.length; g++) {
          const group = setGroups[g]
          for (let i = 0; i < group.length; i++) {
            if ((group[i] as any)[key] != undefined) {
              result.valIsSet = true
              break
            }
          }
          if (result.valIsSet) break
        }
      }
      // else, val IS set
      else result.valIsSet = true
    }

    return result
  }
}
</script>

<style lang="scss">
.details {
  .file {
    overflow-y: scroll;
    white-space: pre;

    line-height: 2;
  }
  .field {
    margin-top: 12px;
    label,
    textarea {
      display: block;
    }
    label,
    input,
    textarea {
      font-size: 14px;
    }
  }
  // .input-row {
  //   display: flex;
  //   label {
  //     flex-grow: 0;
  //     min-width: 60px;
  //     font-size: 10px;
  //   }
  //   input,
  //   textarea {
  //     flex-grow: 1;
  //     font-size: 12px;
  //     border-bottom: 0.5px solid lightgray;
  //     &:disabled {
  //       opacity: 0.75;
  //     }
  //     &:focus-visible {
  //       outline: none;
  //       border-bottom: 0.5px solid black;
  //     }
  //   }
  // }
}
</style>
