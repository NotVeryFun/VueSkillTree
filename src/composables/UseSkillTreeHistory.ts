import type { Node, Edge } from '@vue-flow/core'

export interface HistorySnapshot {
  nodes: Node[]
  edges: Edge[]
}

export function useSkillTreeHistory() {

  const undoStack: HistorySnapshot[] = []
  const redoStack: HistorySnapshot[] = []

  const cloneSnapshot = (
    nodes: Node[],
    edges: Edge[]
  ): HistorySnapshot => {

    return {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    }
  }

  const push = (
    nodes: Node[],
    edges: Edge[]
  ) => {

    undoStack.push(
      cloneSnapshot(nodes, edges)
    )

    // 有新的操作後，Redo 歷史失效
    redoStack.length = 0
  }

  const undo = (
    nodes: Node[],
    edges: Edge[]
  ): HistorySnapshot | null => {

    if (undoStack.length === 0) {
      return null
    }

    // 把目前狀態保存到 Redo
    redoStack.push(
      cloneSnapshot(nodes, edges)
    )

    return undoStack.pop() ?? null
  }

  const redo = (
    nodes: Node[],
    edges: Edge[]
  ): HistorySnapshot | null => {

    if (redoStack.length === 0) {
      return null
    }

    // 把目前狀態保存到 Undo
    undoStack.push(
      cloneSnapshot(nodes, edges)
    )

    return redoStack.pop() ?? null
  }

  return {
    push,
    undo,
    redo,
  }
}