import { Vec2 } from '@/@types/base'
import main from '@/store/modules/main'
import { getDistance } from './math'

const dragDelay = 500
const minDragLimit = 3
let dragDelayTimer: number | undefined
let isDragging = false

const dClickDelay = 500
let dClickTimer: number | undefined

const offset = new Vec2()
const prev = new Vec2()

let elIdOnCursor: string | undefined

export type MouseEventParams = {
  e: MouseEvent
  elId?: string
}

export interface DragEventParams extends MouseEventParams {
  offset: Vec2
}

export function onMouseDown({ e, elId }: MouseEventParams) {
  // save element id
  elIdOnCursor = elId

  // listen to mousemove and mouseup
  window.removeEventListener('mousemove', onMouseMove)
  window.addEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.addEventListener('mouseup', onMouseUp)

  // save starting coords as prevMouseCoords
  prev.x = e.clientX
  prev.y = e.clientY

  // start drag timer
  clearTimeout(dragDelayTimer)
  dragDelayTimer = setTimeout(() => {
    // after delay on drag timer, start drag
    isDragging = true
  }, dragDelay) as any
}

export function onMouseMove(e: MouseEvent) {
  // if not yet dragging
  if (!isDragging) {
    // if moved from start more than limit, start drag
    const dist = getDistance(
      prev.x,
      e.clientX,
      prev.y,
      e.clientY
    )
    if (dist >= minDragLimit) {
      isDragging = true
      main.onDragStart({ e, elId: elIdOnCursor })
    }
  }
  // if dragging, call onDrag
  if (isDragging) {
    // if not moving skip
    if (e.clientX == prev.x && e.clientY == prev.y) return

    offset.x = e.clientX - prev.x
    offset.y = e.clientY - prev.y
    main.onDrag({ e, offset })
    prev.x = e.clientX
    prev.y = e.clientY
  }
}

export function onMouseUp(e: MouseEvent) {
  //  remove self and onMouseMove
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)

  // stop drag timer
  clearTimeout(dragDelayTimer)
  dragDelayTimer = undefined

  // if not dragging
  if (!isDragging) {
    // if double click timer is not started yet
    if (dClickTimer == undefined) {
      // start double click timer
      dClickTimer = setTimeout(() => {
        // after delay
        // treat the last one as click
        main.onClick({ e, elId: elIdOnCursor })
        // remove timer
        dClickTimer = undefined
      }, dClickDelay) as any
    }
    // else
    else {
      // stop the timer
      clearTimeout(dClickTimer)
      dClickTimer = undefined
      // treat as double click
      main.onDoubleClick({ e, elId: elIdOnCursor })
    }
  }
  // else, stop dragging
  else {
    setTimeout(() => {
      isDragging = false
      main.onDragEnd({ e, elId: elIdOnCursor })
    }, 1)
  }
}

export function onMouseEnter(elId?: string) {
  elIdOnCursor = elId
}
export function onMouseLeave(elId?: string) {
  if (elIdOnCursor == elId) elId = undefined
}
