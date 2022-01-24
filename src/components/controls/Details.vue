<template>
  <div class="details pt-4 pl-4 pr-8">
    <small class="overview">
      {{ selectionOverview }}
    </small>
    <!-- File -->
    <!--    colors -->

    <!-- All -->
    <!--    color -->

    <!-- Element -->
    <v-text-field
      v-if="fields.text"
      label="Text"
      placeholder="-"
    />
    <!--    level -->
    <v-text-field
      v-if="fields.text"
      label="Text"
      placeholder="-"
    >
      <template v-slot:prepend>
        <v-icon small>
          mdi-minus
        </v-icon>
      </template>
      <template v-slot:append-outer>
        <v-icon small>
          mdi-plus
        </v-icon>
      </template>
    </v-text-field>
    <!--    hide -->
    <v-checkbox :label="'Hide'" />
    <!--    coords -->
    <!--    parent -->
    <!--    children -->
    <!--    links -->

    <!-- Obj -->

    <!-- Instance -->
    <!--    ref -->

    <!-- Link -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import main from '@/store/modules/main'
import file from '@/store/modules/file'
import { IInstance } from '@/@types/base'

type Button = {
  tooltip: string
  icon: string
  color?: string
  func?: () => void
  disabled?: boolean
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

  fieldGroups: Record<string, Record<string, 1>> = {
    file: {
      // levels: 1,
      colors: 1,
    },
    all: {
      color: 1,
    },
    el: {
      text: 1,
      level: 1,
      hide: 1,

      coords: 1,

      parent: 1,
      children: 1,
      links: 1,
    },
    obj: {
      //
    },
    ins: {
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

  get objSelected() {
    if (!this.selectedEls) return 0
    let result = 0
    for (const id in this.selectedEls)
      if (!(this.file.elements[id] as IInstance).ref)
        result++
    return result
  }

  get insSelected() {
    if (!this.selectedEls) return false
    let result = 0
    for (const id in this.selectedEls)
      if ((this.file.elements[id] as IInstance).ref)
        result++
    return result
  }

  get selectionOverview() {
    if (!this.objSelected && !this.insSelected)
      return 'file name'

    const result: string[] = []
    if (this.objSelected)
      result.push(`${this.objSelected} objs`)
    if (this.insSelected)
      result.push(`${this.insSelected} instances`)

    return result.join(' + ') + ' selected'
  }

  get fields() {
    const { fieldGroups } = this
    const result: Record<string, 1> = {}

    if (!this.file) return result

    // if nothing is selected, display the global details
    if (!this.selectedEls && !this.selectedLinks) {
      for (const field in fieldGroups.file)
        result[field] = 1
    }
    // else, if any is selected,
    else {
      for (const field in fieldGroups.all) result[field] = 1

      // if only Elements
      if (!this.selectedLinks) {
        for (const field in fieldGroups.el)
          result[field] = 1

        // if only one type, display the fields of that type
        if (!this.objSelected || !this.insSelected)
          for (const field in fieldGroups[
            this.objSelected ? 'obj' : 'ins'
          ])
            result[field] = 1
      }
      // if only Links
      if (!this.selectedEls)
        for (const field in fieldGroups.link)
          result[field] = 1
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

    font-size: 10px;
    line-height: 2;
  }
  .v-label,
  .v-input {
    font-size: 12px;
  }
  .input-row {
    display: flex;
    label {
      flex-grow: 0;
      min-width: 60px;
      font-size: 10px;
    }
    input,
    textarea {
      flex-grow: 1;
      font-size: 12px;
      border-bottom: 0.5px solid lightgray;
      &:disabled {
        opacity: 0.75;
      }
      &:focus-visible {
        outline: none;
        border-bottom: 0.5px solid black;
      }
    }
  }
}
</style>
