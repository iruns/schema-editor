<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
})
</script>

<style lang="scss">
#app {
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #eee;
    border-radius: 3px;
    &:hover {
      background: #ddd;
    }
  }
  ::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 35px;
    &:hover {
      background: #ccc;
    }
  }
  .animated {
    transition: all 50ms;
  }
}
</style>
