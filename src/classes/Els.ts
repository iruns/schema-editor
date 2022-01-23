import { ILink, IObj, Vec2 } from '@/@types/base'

export class Obj implements IObj {
  coords: Vec2

  text?: string
  level?: number

  subIds?: Record<string, 1>
  parent?: string

  hidden?: Record<string, true>

  constructor(x = 0, y = 0) {
    this.coords = new Vec2(x, y)
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
