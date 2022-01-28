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
    <!--    hide -->
    <div class="field hidden" v-if="values.hidden">
      <label>Hide</label>
      <input type="checkbox" v-model="values.hidden.val" />
    </div>
    <!--    level -->
    <NumberInput
      v-if="values.level"
      v-model="values.level.val"
      label="Level"
    />
    <!--    coords -->
    <div class="field-row">
      <NumberInput
        class="mr-4"
        v-if="values.x"
        v-model="values.x.val"
        label="X"
        :nudge="10"
      />
      <NumberInput
        v-if="values.y"
        v-model="values.y.val"
        label="Y"
        :nudge="10"
      />
    </div>
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
  IRootClone,
  IFile,
  IObj,
  IElVars,
} from '@/@types/base'

import NumberInput from './NumberInput.vue'

type Button = {
  tooltip: string
  icon: string
  color?: string
  func?: () => void
  disabled?: boolean
}

type FieldKey = keyof IFile | keyof IObj | keyof IRootClone
type Fields = Partial<Record<FieldKey, 1>>

type ValueObj = {
  val: any
  // if includes clones (not root) with set val, add UNSET
  // if no val is set, show as semi transparent
  valIsSet: boolean
  locked?: true
}

@Component({ components: { NumberInput } })
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
    const { fieldgetGroups, selection } = this
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
        if (!selection.objs || !selection.clones)
          for (key in fieldgetGroups[
            selection.objs ? 'obj' : 'clone'
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

    if (fields.x)
      result.x = this.createValObj({
        key: 'x',
        preDisplay: String,
        preSetting: val => (val = parseInt(val) || 0),
        getGroups: [rootEls, childCloneObjRefs],
      })
    if (fields.y)
      result.y = this.createValObj({
        key: 'y',
        preDisplay: String,
        preSetting: val => (val = parseInt(val) || 0),
        getGroups: [rootEls, childCloneObjRefs],
      })

    if (fields.parentId) {
      result.parentId = this.createValObj({
        key: 'parentId',
        locked: !childClones.length,
        getGroups: [rootEls, childCloneObjRefs],
      })
    }

    if (fields.ref)
      result.ref = this.createValObj({
        key: 'ref',
        locked: !childClones.length,
        getGroups: [clones],
      })

    if (fields.hidden)
      result.hidden = this.createValObj({
        key: 'hidden',
        getGroups: [objs, cloneEndStates],
        setGroups: [objs, cloneObjRefs],
      })

    if (fields.color)
      result.color = this.createValObj({
        key: 'color',
        getAll: true,
        getGroups: [objs, cloneEndStates],
        setGroups: [objs, cloneObjRefs],
      })

    if (fields.level)
      result.level = this.createValObj({
        key: 'level',
        preDisplay: String,
        preSetting: val => (val = parseInt(val) || 0),
        getGroups: [objs, cloneObjRefs],
      })

    return result
  }

  createValObj({
    key,
    locked,
    getAll,
    getGroups,
    setGroups,
    preDisplay,
    preSetting,
  }: {
    key: FieldKey
    locked?: boolean
    getAll?: boolean
    getGroups: IElVars[][]
    setGroups?: IAnyEl[][]
    preDisplay?: (val: any) => any
    preSetting?: (val: any) => any
  }) {
    let endVal: any = undefined

    const result: ValueObj = {
      valIsSet: true,
      get val() {
        // if not getAlling, only display if all of the values are the same
        if (!getAll) {
          let same = true
          let first = true

          for (let g = 0; g < getGroups.length; g++) {
            const group = getGroups[g]

            for (let i = 0; i < group.length; i++) {
              const val = (group[i] as any)[key]

              // if first, set endVal
              if (first) {
                endVal = val
                first = false
              }
              // else, compare to previous
              else if (result != val) {
                same = false
                endVal = undefined
                break
              }
            }
            if (!same) break
          }
        }
        // else, getAll all vals
        else {
          const vals: Record<string, 1> = {}
          for (let g = 0; g < getGroups.length; g++) {
            const group = getGroups[g]
            for (let i = 0; i < group.length; i++) {
              const val = (group[i] as any)[key] as string
              if (val !== undefined) vals[val] = 1
            }
          }
          endVal = Object.keys(vals)
        }

        if (preDisplay) endVal = preDisplay(endVal)

        return endVal
      },
      set val(val: any | undefined) {
        if (preSetting) val = preSetting(val)

        // if getting all, just take the first value
        if (getAll) val = val?.[0]

        main.setValsInGroups({
          groups: setGroups || (getGroups as IAnyEl[][]),
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

    if (locked) result.locked = true

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
  .field-row {
    display: flex;
  }
  .field {
    margin-top: 16px;
    label {
      font-size: 12px;
      font-weight: bold;
      color: grey;
    }
    label,
    textarea {
      display: block;
    }
    textarea {
      font-size: 14px;
      background-color: whitesmoke;
      border-radius: 5px;
      padding: 0.4em;
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
