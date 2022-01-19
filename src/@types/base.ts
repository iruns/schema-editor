export type IFile = {
  objStyles: Record<string, IObjStyle>
  linkStyles: Record<string, ILinkStyle>
  els: Record<string, IObj | ILink>
}

export type IObjStyle = {
  level: number
  color?: string
  bgColor?: string
}

export enum ElType {
  OBJ,
  LINK,
}

export type IEl = {
  type: ElType
}

export interface IObj extends IEl {
  type: ElType.OBJ
  coords: Vec2
  text?: string
  style?: string
  subs?: Record<string, IObj>
  parent?: string
  clones?: string[]
  hidden?: true
}

export type ILinkStyle = {
  color?: string
  dashes?: number[]
}

export interface ILink extends IEl {
  type: ElType.LINK
  style?: string
  el0: string
  el1: string
  mid?: Vec2
  arrow0?: true
  arrow1?: true
}

export type Edit = {
  //
}

export type ElSelection = {
  els: Record<string, true> | null
}

export class Vec2 {
  x = 0
  y = 0
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}
