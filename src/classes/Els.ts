import {
  IAnyEl,
  IClone,
  IRootClone,
  IElVars,
  IObj,
  IEl,
  ILink,
  Vec2,
  ILinkVars,
  ILinkClone,
} from '@/@types/base'

abstract class ElBase implements IEl {
  id: string
  path?: string[]

  hidden?: true
  color?: string

  constructor({ id, hidden, color }: IEl) {
    this.id = id
    this.hidden = hidden
    this.color = color
  }
}

export class Obj extends ElBase implements IObj {
  x: number
  y: number

  text?: string
  level: number

  parentId?: string
  childIds?: Record<string, 1>

  hidden?: true

  constructor({
    id,

    x,
    y,

    level = 2,
    text,

    childIds,
    parentId,

    hidden,
    color,
  }: IObj) {
    super({ id, hidden, color })

    this.x = x
    this.y = y

    this.level = level
    this.text = text

    this.parentId = parentId
    this.childIds = childIds

    this.hidden = hidden
  }
}

// CLONE
export class Clone extends ElBase implements IClone {
  ref: IAnyEl
  objRef: IObj

  parentId?: string

  childIds?: Record<string, string> | undefined

  endState: IElVars

  constructor({
    id,
    ref,
    parentId,
    hidden,
    color,
  }: Omit<IClone, 'objRef' | 'refEndState' | 'endState'>) {
    super({ id, hidden, color })

    this.ref = ref

    this.parentId = parentId

    if ((this.ref as IClone).ref) {
      const srcClone = this.ref as IClone

      this.objRef = srcClone.objRef
      this.endState = Object.assign(
        {},
        srcClone.refEndState
      )
    } else {
      const srcObj = this.ref as IObj

      this.objRef = srcObj
      this.endState = {
        hidden: srcObj.hidden,
        color: srcObj.color,
      }
    }
  }

  get refEndState() {
    if ((this.ref as IClone).ref)
      return (this.ref as IClone).endState
    return this.ref as IObj
  }
}

export class CloneRoot extends Clone implements IRootClone {
  isRoot: true = true
  x: number
  y: number

  constructor(
    props: Omit<
      IRootClone,
      'objRef' | 'refEndState' | 'endState' | 'isRoot'
    >
  ) {
    super(props)
    this.x = props.x
    this.y = props.y
  }
}

// LINK
abstract class LinkBase implements ILinkVars {
  from!: IEl
  to!: IEl

  mid?: Vec2

  hidden?: true

  arrowTo?: true
  arrowBack?: true

  // dashed?: true
}
export class Link extends LinkBase implements ILink {
  ups = 0
  downPath?: string[]

  // dashed?: true

  constructor(from: IEl, to: IEl) {
    super()

    this.from = from
    this.to = to
  }
}

export class LinkClone extends LinkBase
  implements ILinkClone {
  ref: ILinkVars

  endState: ILinkVars

  constructor(ref: ILinkVars) {
    super()

    this.ref = ref

    this.endState = {
      from: ref.from,
      to: ref.to,

      mid: ref.mid,

      hidden: ref.hidden,
      color: ref.color,

      arrowTo: ref.arrowTo,
      arrowBack: ref.arrowBack,
    }
  }

  get refEndState() {
    if ((this.ref as ILinkClone).ref)
      return (this.ref as ILinkClone).endState
    return this.ref as ILink
  }
}
