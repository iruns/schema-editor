<template>
  <div class="details pt-4 pl-4 pr-8"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// interface AllTypes
//   extends all other types,

type FieldConfig = {
  type: 'string' | 'number' | 'boolean' | 'object'
  array?: boolean
  staticData?: boolean
}
type FieldConfigs = {
  // [key in keyof AllTypes]: FieldConfig
}

type Field = {
  key: string
  val: any
  rows?: number
  prevVal: any
  config: FieldConfig
  disabled?: boolean
}

type Button = {
  tooltip: string
  icon: string
  color?: string
  func?: () => void
  disabled?: boolean
}

@Component
export default class Details extends Vue {
  fieldConfigs: FieldConfigs = {
    something: { type: 'number' },
  }

  // get fields() {
  //   const result: Field[] = []

  //   if (this.details) {
  //     const details = this.details.state

  //     for (const key in details) {
  //       const config: FieldConfig = (this
  //         .fieldConfigs as any)[key]

  //       if (!config) continue

  //       const val = JSON.stringify(details[key], null, 1)
  //       const rows = Math.min(10, val.split('\n').length)

  //       const field: Field = {
  //         key,
  //         val,
  //         rows,
  //         prevVal: config.array ? [...val] : val,
  //         config,
  //       }

  //       result.push(field)
  //     }
  //   }

  //   return result
  // }

  convertVal(val: any, type?: string) {
    switch (type) {
      case 'number':
        return Number(val)
      case 'boolean':
        return Boolean(val)
      default:
        return val
    }
  }

  get clipboard() {
    return null
  }

  created() {
    //
  }
}
</script>

<style lang="scss">
.details {
  .world {
    overflow-y: scroll;
    white-space: pre;

    font-size: 10px;
    line-height: 2;
  }
  .time-tabs {
    .v-tab {
      font-size: 12px;
      justify-content: left;
      min-width: 20px;
    }
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
