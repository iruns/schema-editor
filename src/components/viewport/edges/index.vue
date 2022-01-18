<template>
  <div class="edges">
    <svg
      :width="borders.maxX - borders.minX"
      :height="borders.maxY - borders.minY"
      :transform="
        `translate(${borders.minX},${borders.minY})`
      "
    >
      <!--  -->
    </svg>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch,
} from 'vue-property-decorator'

import { Vec2 } from '@/@types/base'

@Component({
  components: {
    //
  },
})
export default class Edges extends Vue {
  //
}
</script>

<style lang="scss">
.edges {
  z-index: 5;
  opacity: 0.5;
  pointer-events: none;
  position: absolute;
}
</style>
