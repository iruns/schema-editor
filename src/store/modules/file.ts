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
import {
  IFile,
  IInstanceRoot,
  IRootEl,
  Vec2,
} from '@/@types/base'

const name = 'file'
if ((store as any).state[name]) store.unregisterModule(name)

const els: Record<string, IRootEl> = {
  o0: {
    id: 'o0',
    coords: new Vec2(),
    text: 'Obj0!',
    level: 2,
  },
  o1: {
    id: 'o1',
    coords: new Vec2(100, 0),
    text: 'Obj1',
    level: 2,
  },
  prnt: {
    id: 'prnt',
    coords: new Vec2(100, 100),
    text: 'Parent',
    subIds: { chld0: 1, chld1: 1 },
    level: 2,
  },
  chld0: {
    id: 'chld0',
    coords: new Vec2(100, 0),
    text: 'Child0',
    level: 3,
  },
  chld1: {
    id: 'chld1',
    coords: new Vec2(150, 0),
    text: 'Child1',
    level: 3,
  },
}

const prntIn0: IInstanceRoot = {
  id: 'prntIn0',
  ref: els.prnt,
  objRefId: 'prnt',
  coords: new Vec2(100, 200),
}
els.prntIn0 = prntIn0

const current: IFile = {
  elements: els,
  root: {
    id: 'root',
    subIds: { o0: 1, o1: 1, prnt: 1, prntIn0: 1 },
  },
}

@Module({
  name,
  namespaced: true,
  dynamic: true,
  store,
})
class File extends VuexModule {
  current = current

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
