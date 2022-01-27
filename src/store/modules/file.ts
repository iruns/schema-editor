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
  ICloneRoot,
  IRootEl,
  Vec2,
} from '@/@types/base'
import { CloneRoot, Obj } from '@/classes/Els'

const name = 'file'
if ((store as any).state[name]) store.unregisterModule(name)

const els: Record<string, IRootEl> = {
  o0: new Obj({
    id: 'o0',
    x: 0,
    y: 0,
    text: 'Obj0!',
    level: 2,
  }),
  o1: new Obj({
    id: 'o1',
    x: 100,
    y: 0,
    text: 'Obj1',
    level: 2,
  }),
  prnt: new Obj({
    id: 'prnt',
    x: 100,
    y: 100,
    text: 'Parent',
    childIds: { chld0: 1, chld1: 1 },
    level: 2,
  }),
  chld0: new Obj({
    id: 'chld0',
    x: 100,
    y: 0,
    text: 'Child0',
    level: 3,
  }),
  chld1: new Obj({
    id: 'chld1',
    x: 150,
    y: 0,
    text: 'Child1',
    level: 3,
    hidden: true,
  }),
}

els.prntIn0 = new CloneRoot({
  id: 'prntIn0',
  ref: els.prnt,
  x: 100,
  y: 200,
})

const current: IFile = {
  elements: els,
  root: {
    id: 'root',
    childIds: { o0: 1, o1: 1, prnt: 1, prntIn0: 1 },
  },
  colors: {
    red: 'tomato',
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
    // const folder = req.folder || this.activeFolder
    // if (!folder) return
    // const file = req.file || this.activeFile
    // if (!file) return
    // const start = req.start || 0
    // lines.forEach((line, l) => {
    //   l += start
    //   try {
    //     const data = JSON.parse(line)
    //     Vue.set(this.lines, l, data)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // })
  }
}

export default getModule(File)
