export type IFile = {
  elements: Record<string, IAnyEl>
  root: IObjContainer
  colors: Record<string, string>
}

export type IAnyEl = IObj | ICloneRoot | IClone
export type IRootEl = IObj | ICloneRoot

export type IElVars = {
  hidden?: true
  color?: string

  // link2A?: Record<string, string>
  // link2B?: Record<string, string>
}

export interface IEl extends IElVars {
  id: string
  parentId?: string
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
  // path: string[]

  childIds?: Record<string, string>

  refEndState: IElVars
  endState: IElVars
}
export interface ICloneRoot extends IClone {
  isRoot: true
  x: number
  y: number
}

export type ILink = {
  aS: Record<string, string>
  bS: Record<string, string>

  mid?: Vec2

  arrowA?: true
  arrowB?: true
}

export type ElSelection = {
  els: Record<string, 1> | null
  links: Record<string, 1> | null

  objs: IObj[]
  rootEls: IRootEl[]

  clones: (IClone | ICloneRoot)[]
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
