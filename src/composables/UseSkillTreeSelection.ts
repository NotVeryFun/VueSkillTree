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
    onEdgeClick,
    onPaneClick,
    onSelectionDragStop,
    onSelectionEnd,
    getNodes,
    removeSelectedNodes,
    findNode,
  
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
const updateSelectionSelectedNodes = ({
    nodeId: id,
    e,
}: {
    nodeId: string
    e: PointerEvent
}) => {
    console.log('Shift:', e.shiftKey)

    const node = findNode(id)

    if (node == undefined) {
        return
    }

    const currNodes = getNodes.value

    // 沒有按 Shift → 清除其他選取
    if (!e.shiftKey) {
        for (const n of currNodes) {
            n.selected = false
        }
    }

    // 按 Shift → 保留原本選取狀態
    node.selected = !node.selected

    requestAnimationFrame(() => {
        
    })
    _updateSelectedNodes()

    selectedEdges.value = []
}

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

  const _updateSelectedNodes = () => {

    const nodes: GraphNode<any, any, string>[] = getNodes.value

    const selected = []

    for (const node of nodes) {
        if (node.selected) {
            selected.push(node)
        }
    }

    selectedNodes.value = selected
  }

  onSelectionEnd(
    (_e: globalThis.MouseEvent) => {
      _updateSelectedNodes()
    }
  )

  // ============================================================
  // Ctrl + D
  // ============================================================

  const duplicateSelected = () => {
    if (selectedNodes.value.length === 0) {
      return
    }

    const newNodes = duplicateSelectedNodes()
    console.log("[duplicateSelected]")
    console.log(selectedNodes)
    // Vue Flow 更新 Node selection 後，
    // 下一幀重新取得實際選取狀態
    
    requestAnimationFrame(() => {
      _updateSelectedNodes()
    })

    
    selectedNodes.value = newNodes
    selectedEdges.value = []
  }

  // ============================================================
  // Delete
  // ============================================================

  const deleteSelected = () => {
    if (selectedNodes.value.length > 0) {
      const node_ids = []

      for(const n of selectedNodes.value){
        node_ids.push(n.id)

      }
      console.log(node_ids)

      deleteNodes(node_ids)

      clearSelection()
    }

    if (selectedEdges.value.length > 0) {
      const edge_ids = []

      for(const e of selectedEdges.value){
        edge_ids.push(e.id)

      }

      deleteEdges(edge_ids)

      clearSelection()
    }
  }

  // ============================================================
  // 外部設定選取 Node
  // ============================================================

  const setSelectedNodes = (
    nodes: (
      GraphNode<SkillNodeData> | null
    )[]
  ) => {

    const selected = []

    for (const node of nodes) {
        if (node !== null) {
            selected.push(node)
        }
    }

    selectedNodes.value = selected;
      
  }

  return {
  selectedNodes,
  selectedEdges,

  clearSelection,

  setSelectedNodes,

  duplicateSelected,
  deleteSelected,
  updateSelectionSelectedNodes
}
}