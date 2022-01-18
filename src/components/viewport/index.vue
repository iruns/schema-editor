<template>
  <div class="viewport">
    <div id="ref-el-viewport" />
    <!-- content -->
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator'

import file from '@/store/modules/file'

@Component({
  components: {
    //
  },
})
export default class Viewport extends Vue {
  @Prop({ type: Number, default: 1 })
  zoomLevel!: number
  @Watch('zoomLevel', {
    immediate: true,
  })
  onZoom(val: number) {
    //
  }

  get file() {
    return file
  }

  @Watch('file.details.staticData', {
    immediate: true,
  })
  onStaticData(val?: any) {
    //
  }
  // get staticData() {

  // }
}
</script>

<style lang="scss">
.viewport {
  user-select: none;
  position: relative;
  #ref-el-viewport {
    width: 100px;
    height: 100px;
    position: absolute;
  }
  .selector {
    fill: black;
    background-color: black;
    cursor: pointer;
    opacity: 0;
  }
  .selection {
    fill: blue;
    background-color: blue;
    opacity: 0.15;
  }
}
</style>
