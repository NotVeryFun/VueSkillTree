import type { XYPosition } from '@vue-flow/core'

// ============================================================
// Grid / Center alignment single source of truth
//
// VueFlow v1 position = 左上角,沒有 node-origin,
// 所以「中心對齊」一律換算: topLeft = snap(center) - size / 2
// ============================================================

export const SNAP_GRID_X = 32
export const SNAP_GRID_Y = 32

export const SNAP_GRID: [number, number] = [SNAP_GRID_X, SNAP_GRID_Y]

export const BACKGROUND_GAP = 64

export const DEFAULT_NODE_WIDTH = 128
export const DEFAULT_NODE_HEIGHT = 128

// Handle 長出新節點時,中心點距離 (32 * 6,保持格點倍數)
export const NEW_NODE_OFFSET = 192

// 複製節點時,中心點位移 (32 * 2)
export const DUPLICATE_OFFSET = 64

export function snapValue(value: number, grid: number): number {
  return Math.round(value / grid) * grid
}

export function snapPosition(pos: XYPosition): XYPosition {
  return {
    x: snapValue(pos.x, SNAP_GRID_X),
    y: snapValue(pos.y, SNAP_GRID_Y),
  }
}

/** 中心點 -> 左上角 (VueFlow v1 position格式) */
export function centerToTopLeft(
  center: XYPosition,
  width: number = DEFAULT_NODE_WIDTH,
  height: number = DEFAULT_NODE_HEIGHT,
): XYPosition {
  return {
    x: center.x - width / 2,
    y: center.y - height / 2,
  }
}

/** 左上角 -> 中心點 */
export function topLeftToCenter(
  topLeft: XYPosition,
  width: number = DEFAULT_NODE_WIDTH,
  height: number = DEFAULT_NODE_HEIGHT,
): XYPosition {
  return {
    x: topLeft.x + width / 2,
    y: topLeft.y + height / 2,
  }
}

/**
 * 把「期望的中心點」吸附到格子,再換算回左上角。
 * 這是所有新增 / 拖曳校正的唯一入口。
 */
export function snapCenterToTopLeft(
  center: XYPosition,
  width: number = DEFAULT_NODE_WIDTH,
  height: number = DEFAULT_NODE_HEIGHT,
): XYPosition {
  const snappedCenter = snapPosition(center)
  return centerToTopLeft(snappedCenter, width, height)
}

interface SizeLike {
  dimensions?: { width?: number; height?: number }
  width?: number | string | ((...args: never[]) => unknown) | null | undefined
  height?: number | string | ((...args: never[]) => unknown) | null | undefined
}

function toNumber(value: number | string | null | undefined, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }
  return fallback
}

/** 取得節點實際尺寸,優先 dimensions,其次 width/height,最後預設值 */
export function getNodeSize(node: SizeLike): { width: number; height: number } {
  const width = toNumber(
    node.dimensions?.width ?? (node.width as number | string | undefined),
    DEFAULT_NODE_WIDTH,
  )
  const height = toNumber(
    node.dimensions?.height ?? (node.height as number | string | undefined),
    DEFAULT_NODE_HEIGHT,
  )
  return { width, height }
}
