<template>
  <div class="viewport">
    <div v-if="currentFile" class="file">
      <div id="ref-el-viewport" />
      <div class="objs">
        <template v-for="(el, eId) in currentFile.els">
          <Obj
            v-if="el.type == elType.obj"
            :key="eId"
            :id="eId"
            :state="el"
          />
        </template>
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

import { ElType } from '@/@types/base'

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

  elType = {
    obj: ElType.OBJ,
    link: ElType.LINK,
  }

  get currentFile() {
    return file.current
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
