import {
  IAnyEl,
  IClone,
  ICloneRoot,
  IElVars,
  IObj,
} from '@/@types/base'

export class Obj implements IObj {
  id: string

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
  }: IObj) {
    this.id = id

    this.x = x
    this.y = y

    this.level = level
    this.text = text

    this.parentId = parentId
    this.childIds = childIds
  }
}

export class Clone implements IClone {
  id: string

  ref: IAnyEl
  objRef: IObj

  parentId?: string

  childIds?: Record<string, string> | undefined

  endState: IElVars

  constructor({
    id,
    ref,
    parentId,
  }: {
    id: string
    ref: IAnyEl
    parentId?: string
  }) {
    this.id = id

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

export class CloneRoot extends Clone implements ICloneRoot {
  isRoot: true = true
  x: number
  y: number

  constructor(props: {
    id: string
    ref: IAnyEl
    x: number
    y: number
    parentId?: string
  }) {
    super(props)
    this.x = props.x
    this.y = props.y
  }
}

// export class Link implements ILink {
//   type: ElType.LINK = ElType.LINK

//   style?: string

//   el0: string
//   el1: string

//   mid?: Vec2

//   arrow0?: true
//   arrow1?: true

//   constructor(el0: string, el1: string) {
//     this.el0 = el0
//     this.el1 = el1
//   }
// }
