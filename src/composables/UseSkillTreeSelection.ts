import { ref } from 'vue'

import {
  useVueFlow,
  type GraphNode,
  type GraphEdge,
  type NodeDragEvent,
} from '@vue-flow/core'

import { useSkillTreeActions } from './UseSkillTreeActions'
import type { SkillNodeData } from '../type/SkillNode'


export function useSkillTreeSelection() {
  const {
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    onSelectionDragStop,
    onSelectionEnd,
    getNodes,
    removeSelectedNodes
  } = useVueFlow()

  const {
    deleteNodes,
    deleteEdges,
    duplicateSelectedNodes,
  } = useSkillTreeActions()

  const selectedNodes =
    ref<GraphNode<SkillNodeData>[]>([])

  const selectedEdges =
    ref<GraphEdge[]>([])

  // ============================================================
  // 清除選取
  // ============================================================

  const clearSelection = () => {

    removeSelectedNodes(
        getNodes.value.filter(
        node => node.selected
        )
    )

    selectedNodes.value = []
    selectedEdges.value = []
    }

  // ============================================================
  // 點擊 Node
  // ============================================================

 onNodeClick(({ node }) => {
  console.log('[Selection] Node Click:', node.id)

  // 等 Vue Flow 更新 selected 狀態
  requestAnimationFrame(() => {
    updateSelectedNodes()

    console.log(
      '[Selection] FINAL:',
      selectedNodes.value.map(node => node.id)
    )
  })

  selectedEdges.value = []
})

  // ============================================================
  // 點擊 Edge
  // ============================================================

  onEdgeClick(({ edge }) => {

    clearSelection()

    selectedEdges.value = [edge]

    })
  // ============================================================
  // 點擊 Pane
  // ============================================================

  onPaneClick(() => {
    clearSelection()
  })

  // ============================================================
  // 框選結束 / Drag Stop
  // ============================================================

  onSelectionDragStop(
    (e: NodeDragEvent) => {
      selectedNodes.value =
        e.nodes as GraphNode<SkillNodeData>[]

      selectedEdges.value = []
    }
  )

  // ============================================================
  // 更新目前被選取的 Node
  // ============================================================

  const updateSelectedNodes = () => {

    selectedNodes.value = getNodes.value.filter(
        (node) => node.selected
    )

    console.log(
        '[Selection] Sync:',
        selectedNodes.value.map(node => node.id)
    )
}

  onSelectionEnd(
    (_e: globalThis.MouseEvent) => {
      updateSelectedNodes()
    }
  )

  // ============================================================
  // Ctrl + D
  // ============================================================

  const duplicateSelected = () => {
    if (selectedNodes.value.length === 0) {
      return
    }

    let newNodes = duplicateSelectedNodes()
    console.log("[duplicateSelected]")
    console.log(selectedNodes)
    // Vue Flow 更新 Node selection 後，
    // 下一幀重新取得實際選取狀態
    
    requestAnimationFrame(() => {
      updateSelectedNodes()
    })

    
    selectedNodes.value = newNodes
    selectedEdges.value = []
  }

  // ============================================================
  // Delete
  // ============================================================

  const deleteSelected = () => {
    if (selectedNodes.value.length > 0) {
      const ids = selectedNodes.value.map(
        node => node.id
      )
      console.log(ids)

      deleteNodes(ids)

      clearSelection()
    }

    if (selectedEdges.value.length > 0) {
      const ids = selectedEdges.value.map(
        edge => edge.id
      )

      deleteEdges(ids)

      clearSelection()
    }
  }

  // ============================================================
  // Keyboard
  // ============================================================

  const handleKeyDown = (
    event: KeyboardEvent
  ) => {

    // ============================================================
    // 正在輸入文字時，不處理快捷鍵
    // ============================================================

    if (
        event.ctrlKey &&
        event.key.toLowerCase() === 'd'
        ) {
        event.preventDefault()

        console.log(
            '[Ctrl+D] selectedNodes:',
            selectedNodes.value.map(node => node.id)
        )

        console.log(
            '[Ctrl+D] selectedNodes count:',
            selectedNodes.value.length
        )

            duplicateSelected()
        }

    // ============================================================
    // Delete / Backspace
    // ============================================================

    if (
      event.key !== 'Delete' &&
      event.key !== 'Backspace'
    ) {
      return
    }

    event.preventDefault()

    deleteSelected()
  }

  // ============================================================
  // 外部設定選取 Node
  // ============================================================

  const setSelectedNodes = (
    nodes: (
      GraphNode<SkillNodeData> | null
    )[]
  ) => {
    selectedNodes.value =
      nodes.filter(
        (
          node
        ): node is GraphNode<SkillNodeData> =>
          node !== null
      )
  }

  return {
    selectedNodes,
    selectedEdges,

    clearSelection,

    handleKeyDown,

    setSelectedNodes,

    duplicateSelected,
  }
}