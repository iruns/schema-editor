import { Vec2 } from '@/@types/base'

export function sameSign(a: number, b: number) {
  a = Math.round(a)
  b = Math.round(b)

  if (a > 0) {
    if (b > 0) return true
    return false
  }
  if (a < 0) {
    if (b < 0) return true
    return false
  }
  return true
}

export const degToRad = Math.PI / 180

export function toRad(degree: number) {
  return degree * degToRad
}

export const radToDeg = 180 / Math.PI

export function toDeg(rad: number) {
  return rad * radToDeg
}

export function toPrecision(num: number, precision = 2) {
  const m = 10 ** precision
  return Math.round(num * m) / m
}

export function lerp(
  min: number,
  max: number,
  t: number
): number {
  return min + (max - min) * t
}
export function unlerp(
  min: number,
  max: number,
  v: number,
  clampResult?: boolean
): number {
  if (!clampResult) return (v - min) / (max - min)
  return clamp(0, 1, (v - min) / (max - min))
}

export function clamp(min: number, max: number, n: number) {
  return Math.max(Math.min(n, max), min)
}

export function raiseBy(n: number, pow: number) {
  const isPost = n > 0 ? true : false
  const result = Math.abs(n) ** pow
  return isPost ? result : -result
}

export function getDistance(
  x1: number,
  x2: number,
  y1: number,
  y2: number
) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export function emptyVec2(vec2: Vec2) {
  vec2.x = 0
  vec2.y = 0
}

export function addVec2s(to: Vec2, from: Vec2) {
  to.x += from.x
  to.y += from.y
}

export function multVec2(vec2: Vec2, mult: number) {
  vec2.x *= mult
  vec2.y *= mult
}

export function setVec2(vec2: Vec2, x = 0, y = 0) {
  vec2.x = x
  vec2.y = y
}

export function copyVec2(to: Vec2, from: Vec2) {
  to.x = from.x
  to.y = from.y
}

export function cloneVec2(vec2: Vec2) {
  return new Vec2(vec2.x, vec2.y)
}
