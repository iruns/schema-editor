<template>
  <div class="viewport">
    <div v-if="currentFile" class="file">
      <div id="ref-el-viewport" />
      <div class="objs">
        <Obj
          v-for="(el, eId) in currentFile.root.childIds"
          :key="eId"
          :elements="elements"
          :state="elements[eId]"
        />
      </div>
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

import file from '@/store/modules/file'
import Obj from '@/components/viewport/Obj.vue'

@Component({
  components: {
    Obj,
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

  get currentFile() {
    return file.current
  }

  get elements() {
    return this.currentFile?.elements || null
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
    pointer-events: none;
  }
  .objs,
  .links {
    pointer-events: none;
    position: relative;
  }
}
</style>
