export type IFile = {
  elements: Record<string, IAnyEl>
  root: IObjContainer
}

export type IAnyEl = IObj | IInstanceRoot | IInstance
export type IRootEl = IObj | IInstanceRoot

export type IElVars = {
  hidden?: true
  color?: string

  link2A?: Record<string, string>
  link2B?: Record<string, string>
}

export interface IEl extends IElVars {
  id: string
}

export interface IObjContainer extends IEl {
  subIds?: Record<string, 1>
}

export interface IObj extends IObjContainer {
  coords: Vec2

  text?: string
  level?: number
}

export interface IInstance extends IEl {
  ref: IAnyEl
  objRefId: string
  // path: string[]

  subIds?: Record<string, string>

  refState?: IElVars
}
export interface IInstanceRoot extends IInstance {
  coords: Vec2
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
}

export class Vec2 {
  x = 0
  y = 0
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}
