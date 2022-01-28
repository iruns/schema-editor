export type IFile = {
  elements: Record<string, IAnyEl>
  root: IObjContainer
  colors: Record<string, string>
}

export type IAnyEl = IObj | IRootClone | IClone
export type IRootEl = IObj | IRootClone

export type IElVars = {
  hidden?: true
  color?: string
}

export interface IEl extends IElVars {
  id: string
  parentId?: string

  path?: string[]
  linkTos?: Record<string, string>
}

export interface IObjContainer extends IEl {
  childIds?: Record<string, 1>
}

export interface IObj extends IObjContainer {
  x: number
  y: number

  text?: string
  level: number
}

export interface IClone extends IEl {
  ref: IAnyEl

  objRef: IObj

  childIds?: Record<string, string>

  refEndState: IElVars
  endState: IElVars
}
export interface IRootClone extends IClone {
  isRoot: true
  x: number
  y: number
}

export interface ILinkVars extends IElVars {
  from: IEl
  to: IEl

  mid?: Vec2

  hidden?: true

  arrowTo?: true
  arrowBack?: true

  // dashed?: true
}
export interface ILink extends ILinkVars {
  ups: number
  downPath?: string[]
}

export interface ILinkClone extends ILinkVars {
  ref: ILinkVars

  refEndState: ILinkVars
  endState: ILinkVars
}

export type ElSelection = {
  els: Record<string, 1> | null
  links: Record<string, 1> | null

  objs: IObj[]
  rootEls: IRootEl[]

  clones: (IClone | IRootClone)[]
  childClones: IClone[]

  cloneObjRefs: IObj[]
  rootCloneObjRefs: IObj[]
  childCloneObjRefs: IObj[]

  cloneEndStates: IElVars[]
}

export class Vec2 {
  x = 0
  y = 0
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}
