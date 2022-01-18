<template>
  <div class="help px-4">
    <h1>Keyboard</h1>
    <p>Pan: <b>Arrows</b></p>
    <p>Pan more: <b>SHIFT + Arrows</b></p>
    <p>Zoom: <b>CTRL + Arrow Up/Down</b></p>
    <p>Next/Prev step: <b>ALT + Arrows</b></p>
    <p>Next/Prev 5 steps: <b>ALT + SHIFT + Arrows</b></p>
    <v-divider />
    <h1>Mouse</h1>
    <p>Pan: <b>Mouse drag</b></p>
    <p>Zoom: <b>CTRL + wheel</b></p>
    <p>Next/Prev step: <b>ALT + wheel</b></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Help extends Vue {
  //
}
</script>

<style lang="scss">
.help {
  h1 {
    font-size: 12px;
    text-transform: uppercase;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  p {
    font-size: 12px;
  }
}
</style>
