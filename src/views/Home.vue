<template>
  <div class="home" ref="home">
    <div :class="{ viz: true, moving: altIsDown }">
      <ViewController
        :initialZoom="zoomLevel"
        :onZoom="setzoomLevel"
        @mousedown.left.native="onBGMouseDown"
        @click.left.exact.native="onBGClick"
      >
        <Viewport />
      </ViewController>
    </div>
    <Sidebar />
    <!-- <GeneralUI /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GeneralUI from '@/components/GeneralUI.vue'
import ViewController from '@/components/ViewController.vue'
import Viewport from '@/components/viewport/index.vue'
import Sidebar from '@/components/controls/Sidebar.vue'

import viewportModule from '@/store/modules/viewport'

import { Vec2 } from '@/@types/base'
import { onMouseDown } from '@/utils/mouse'

@Component({
  components: {
    GeneralUI,
    ViewController,
    Viewport,
    Sidebar,
  },
})
export default class Home extends Vue {
  // get modules() {
  //   if (!file.details) return []
  //   else return Object.keys(file.details.infos.modules)
  // }

  get zoomLevel() {
    return viewportModule.zoomLevel
  }
  setzoomLevel(val: number) {
    viewportModule.setZoomLevel(val)
  }

  onBGMouseDown(e: MouseEvent) {
    // if (e.altKey) viewportModule.startDrag(e)
    onMouseDown({ e })
  }
  onBGClick(e: MouseEvent) {
    // if (!e.altKey) viewportModule.selectEl({})
  }

  outosaveInterval = 1000 * 60 * 5

  created() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  altIsDown = false
  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Alt':
        e.preventDefault()
        this.altIsDown = true
        break
    }
  }
  onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case 'Alt':
        this.altIsDown = false
        break
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
  grid-template-areas: 'viz sidebar';

  .viz {
    position: relative;
    grid-area: viz;
    display: flex;
    overflow: hidden;
    &.moving {
      cursor: move;
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
