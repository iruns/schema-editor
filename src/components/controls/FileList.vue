<template>
  <div class="file-list px-4">
    <v-list
      v-for="(files, folder) in fileNames"
      :key="folder"
      dense
    >
      <v-subheader class="pr-2">
        {{ folder }}
      </v-subheader>

      <template v-if="files.length">
        <div class="primary--text">
          <v-list-item
            v-for="file in files"
            :key="file"
            @click="selectFile({ folder, file })"
            :class="{
              'file pr-2': true,
              'v-item--active v-list-item--active':
                folder == activeFolder &&
                file == activeFile,
            }"
            color="primary"
          >
            <v-list-item-icon class="mr-2">
              <v-icon v-text="'mdi-file-outline'" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="file" />
            </v-list-item-content>
          </v-list-item>
        </div>
      </template>
      <template v-else>
        <v-list-item disabled>
          <v-list-item-icon class="mr-2">
            <v-icon v-text="'mdi-file-outline'" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'no files'" />
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider />
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import socket from '@/utils/socketio'

import {
  DataReq,
  DataRes,
  FileNamesRes,
  ServerResType,
} from '@/@types/server'

import file from '@/store/modules/file'

type Button = {
  tooltip: string
  icon: string
  color?: string
  func?: (folder: string) => void
  disabled?: boolean
}

// mdi-plus-circle-outline
// mdi-dots-vertical
@Component
export default class FileList extends Vue {
  created() {
    socket.on(
      ServerResType.FILE_NAMES,
      (payload: FileNamesRes) => {
        file.setFileNames(payload)

        // If no active folder OR file, and if there are ones in localStorage, AND they match the list
        // select them
        if (!this.activeFolder || !this.activeFile) {
          const folder = window.localStorage.getItem(
            'lastFolder:'
          )
          const file = window.localStorage.getItem(
            'lastFile:'
          )
          if (
            folder &&
            file &&
            this.fileNames[folder] &&
            this.fileNames[folder].includes(file)
          ) {
            this.selectFile({ folder, file }, false)
          }
        }
      }
    )

    socket.on(
      ServerResType.LINES_READ,
      (payload: DataRes) => {
        file.receiveData(payload)
      }
    )
  }

  get fileNames() {
    return file.fileNames
  }
  get activeFile() {
    return file.activeFile
  }
  get activeFolder() {
    return file.activeFolder
  }

  selectFile(payload: DataReq, saveToLocal = true) {
    file.pickFile(payload)

    if (saveToLocal) {
      window.localStorage.setItem(
        'lastFolder:',
        payload.folder!
      )
      window.localStorage.setItem(
        'lastFile:',
        payload.file!
      )
    }
  }
}
</script>

<style lang="scss">
.file-list {
  p {
    font-size: 10px;

    margin: 0;
    line-height: 2;

    cursor: pointer;
    &.selected {
      font-weight: bolder;
    }
  }
}
</style>
