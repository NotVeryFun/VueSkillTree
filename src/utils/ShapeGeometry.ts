import type { XYPosition } from '@vue-flow/core'

export type ShapeType =
  | 'square'
  | 'circle'
  | 'rounded-rectangle'


export function getBoundaryPoint(
  shape: ShapeType,
  center: XYPosition,
  direction: XYPosition,
  width: number,
  height: number,
  borderRadius = 12,
): XYPosition {

  switch (shape) {

    case 'circle':
      return getCircleBoundaryPoint(
        center,
        direction,
        width,
        height,
      )

    case 'square':
      return getRectangleBoundaryPoint(
        center,
        direction,
        width,
        height,
      )

    case 'rounded-rectangle':
      return getRoundedRectangleBoundaryPoint(
        center,
        direction,
        width,
        height,
        borderRadius,
      )

    default:
      return center
  }
}
function getCircleBoundaryPoint(
  center: XYPosition,
  direction: XYPosition,
  width: number,
  height: number,
): XYPosition {

  const radius = Math.min(width, height) / 2

  const length = Math.sqrt(
    direction.x * direction.x +
    direction.y * direction.y
  )

  if (length === 0) {
    return center
  }

  const dx = direction.x / length
  const dy = direction.y / length

  return {
    x: center.x + dx * radius,
    y: center.y + dy * radius,
  }
}

function getRectangleBoundaryPoint(
  center: XYPosition,
  direction: XYPosition,
  width: number,
  height: number,
): XYPosition {

  const hw = width / 2
  const hh = height / 2

  const tx =
    direction.x !== 0
      ? hw / Math.abs(direction.x)
      : Infinity

  const ty =
    direction.y !== 0
      ? hh / Math.abs(direction.y)
      : Infinity

  const t = Math.min(tx, ty)

  return {
    x: center.x + direction.x * t,
    y: center.y + direction.y * t,
  }
}

function getRoundedRectangleBoundaryPoint(
  center: XYPosition,
  direction: XYPosition,
  width: number,
  height: number,
  radius: number,
): XYPosition {

  const halfWidth = width / 2
  const halfHeight = height / 2

  const maxRadius = Math.min(
    halfWidth,
    halfHeight,
  )

  const r = Math.min(
    radius,
    maxRadius,
  )

  const absX = Math.abs(direction.x)
  const absY = Math.abs(direction.y)

  if (absX === 0 && absY === 0) {
    return center
  }

  // ------------------------------------------------
  // 先計算普通矩形邊界
  // ------------------------------------------------

  const scaleX =
    absX === 0
      ? Infinity
      : halfWidth / absX

  const scaleY =
    absY === 0
      ? Infinity
      : halfHeight / absY

  const rectangleScale = Math.min(
    scaleX,
    scaleY,
  )

  const hitX = direction.x * rectangleScale
  const hitY = direction.y * rectangleScale

  // ------------------------------------------------
  // 判斷是否落在圓角區域
  // ------------------------------------------------

  const cornerX = halfWidth - r
  const cornerY = halfHeight - r

  const isCorner =
    Math.abs(hitX) > cornerX &&
    Math.abs(hitY) > cornerY

  if (!isCorner) {
    return {
      x: center.x + hitX,
      y: center.y + hitY,
    }
  }

  // ------------------------------------------------
  // 圓角 = 一個圓
  // ------------------------------------------------

  const cornerCenterX =
    Math.sign(direction.x) * cornerX

  const cornerCenterY =
    Math.sign(direction.y) * cornerY

  const dx = direction.x
  const dy = direction.y

  const a =
    dx * dx +
    dy * dy

  const b =
    -2 *
    (
      dx * cornerCenterX +
      dy * cornerCenterY
    )

  const c =
    cornerCenterX * cornerCenterX +
    cornerCenterY * cornerCenterY -
    r * r

  const discriminant =
    b * b - 4 * a * c

  if (discriminant < 0) {
    return {
      x: center.x + hitX,
      y: center.y + hitY,
    }
  }

  const t =
    (-b + Math.sqrt(discriminant)) /
    (2 * a)

  return {
    x: center.x + dx * t,
    y: center.y + dy * t,
  }
}