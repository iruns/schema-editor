<template>
  <div class="help px-4">
    <h1>Navigation</h1>

    <h2>Keyboard</h2>
    <p>Zoom: <b>CTRL + Arrow Up/Down</b></p>
    <v-divider />

    <h2>Mouse</h2>
    <p>Pan: <b>RMB drag, CTRL + LMB drag</b></p>
    <p>Zoom: <b>CTRL + wheel</b></p>
    <v-divider />

    <h1>Editing</h1>
    <p>Add root obj: <b>CTRL + 2LMB on root</b></p>
    <p>Add child obj: <b>CTRL + 2LMB on parent area</b></p>
    <p>
      Parent selected obj(s):
      <b>ALT + 2LMB on parent area</b>
    </p>
    <p>
      Unparent selected obj(s): <b>ALT + 2LMB on root</b>
    </p>
    <p>
      Link selected obj: <b>ALT + LMB on target area</b>
    </p>
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
  h2 {
    font-size: 10px;
    text-transform: uppercase;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  p {
    font-size: 12px;
  }
}
</style>
