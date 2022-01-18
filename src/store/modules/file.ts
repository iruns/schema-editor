import {
  VuexModule,
  Module,
  Mutation,
  getModule,
  Action,
} from 'vuex-module-decorators'
import store from '..'

import Vue from 'vue'

import socket from '@/utils/socketio'
import { clamp } from '@/utils/math'
import {
  FileNamesRes,
  DataReq,
  DataRes,
  ServerReqType,
} from '@/@types/server'

const name = 'file'
if ((store as any).state[name]) store.unregisterModule(name)

@Module({
  name,
  namespaced: true,
  dynamic: true,
  store,
})
class File extends VuexModule {
  // Getting file list
  fileNames: Record<string, string[]> = {}
  @Mutation setFileNames({ folder, files }: FileNamesRes) {
    Vue.set(this.fileNames, folder, files)
  }

  // Opening sim files
  activeFolder: string | null = null
  activeFile: string | null = null
  lines: any[] = []

  @Mutation pickFile(payload: DataReq) {
    Vue.set(this, 'activeFolder', payload.folder!)
    Vue.set(this, 'activeFile', payload.file!)

    payload.start = 0
    payload.end = 1

    socket.emit(ServerReqType.REQ_DATA, payload)
  }

  @Mutation receiveData({ req, lines }: DataRes) {
    const folder = req.folder || this.activeFolder
    if (!folder) return

    const file = req.file || this.activeFile
    if (!file) return

    const start = req.start || 0

    lines.forEach((line, l) => {
      l += start
      try {
        const data = JSON.parse(line)
        Vue.set(this.lines, l, data)
      } catch (error) {
        console.log(error)
      }
    })
  }
}

export default getModule(File)
