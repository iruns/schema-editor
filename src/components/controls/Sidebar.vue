<template>
  <div class="sidebar">
    <div class="content">
      <v-tabs v-model="tab" style="flex-grow: 0">
        <v-tab v-for="tab in tabs" :key="tab">
          {{ tab }}
        </v-tab>
      </v-tabs>
      <v-tabs-items
        v-model="tab"
        style="flex: 1 1 auto;overflow-y: scroll;"
      >
        <v-tab-item key="details">
          <Details />
        </v-tab-item>
        <v-tab-item key="fileList" eager>
          <FileList />
        </v-tab-item>
        <v-tab-item key="help" eager>
          <Help />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Details from '@/components/controls/Details.vue'
import FileList from '@/components/controls/FileList.vue'
import Help from '@/components/controls/Help.vue'

type Button = {
  tooltip: string
  icon: string
  color?: string
  func?: () => void
  disabled?: boolean
}

@Component({
  components: {
    Details,
    FileList,
    Help,
  },
})
export default class Sidebar extends Vue {
  tab = 0
  tabs = ['details', 'fileList', 'help']
}
</script>

<style lang="scss">
.sidebar {
  .content {
    height: 100vh;
    // overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }
  .bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>
