<template>
  <div class="home" ref="home">
    <div class="viz">
      <ViewController
        class="viz-mod"
        :style="{ width: moduleWidth }"
        :initialZoom="zoomLevel"
        :onZoom="setzoomLevel"
        :onClick="onBGClick"
        :onRightClick="onBGRightClick"
      >
        <!-- viewport -->
      </ViewController>
    </div>
    <Sidebar />
    <!-- <GeneralUI /> -->
  </div>
</template>

<script lang="ts">
// TODO don't use flex, split manually up to 2 mods
import { Component, Vue } from 'vue-property-decorator'
import GeneralUI from '@/components/GeneralUI.vue'
import ViewController from '@/components/ViewController.vue'
import Sidebar from '@/components/controls/Sidebar.vue'

import file from '@/store/modules/file'

import { Vec2 } from '@/@types/base'

@Component({
  components: {
    GeneralUI,
    ViewController,
    Sidebar,
  },
})
export default class Home extends Vue {
  // get modules() {
  //   if (!file.details) return []
  //   else return Object.keys(file.details.infos.modules)
  // }

  zoomLevel = 0.75
  setzoomLevel(zoomLevel: number) {
    this.zoomLevel = zoomLevel
  }

  splitFraction = 0.3

  onBGClick() {
    // main.emptySelection()
  }

  // Context menu
  onBGRightClick(mouseEvent: MouseEvent, svgCoords: Vec2) {
    //
  }
  outosaveInterval = 1000 * 60 * 5

  created() {
    window.addEventListener('keydown', this.onKey)
  }

  onKey(e: KeyboardEvent) {
    if (e.altKey) {
      const s = e.shiftKey ? 5 : 1
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          // nudge
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          // nudge
          break
      }
    }
  }
}
</script>

<style lang="scss">
.home {
  width: 100vw;
  height: 100vh;

  background-color: #f9f9f9;
  position: relative;

  display: grid;
  grid-template-columns: auto 300px;
  grid-template-rows: auto 50px;
  grid-template-areas:
    'viz sidebar'
    'player sidebar';

  .viz {
    position: relative;
    grid-area: viz;
    display: flex;
    overflow: hidden;
    viz-mod {
      height: 100%;
      overflow: hidden;
    }
  }
  .sidebar {
    grid-area: sidebar;
  }
  input {
    &:focus-visible {
      outline: none;
    }
  }
}
</style>
