import { computed } from 'vue'

import {
  useVueFlow,
} from '@vue-flow/core'

import { useSkillTreeActions } from './UseSkillTreeActions'


export function useSkillTreeSelection(BeforeAction : () => void) {
  const {
    onEdgeClick,
    getNodes,
    getEdges,
    removeSelectedNodes,
    addSelectedEdges,
    findNode,
    addSelectedNodes  
  } = useVueFlow()

  const {
    deleteNodes,
    deleteEdges,
    duplicateSelectedNodes,
  } = useSkillTreeActions()

  // ============================================================
  // 清除選取
  // ============================================================

  const clearSelectionNode = () => {

      removeSelectedNodes(
          getNodes.value.filter(
          node => node.selected
          )
      )
  }


  const selectedNodes = computed(() => {
    return getNodes.value.filter((n) => n.selected)
  })

  const selectedEdges = computed(() => {
    return getEdges.value.filter((e) => e.selected)
  })

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
    //node.selected = !node.selected
    /*
    requestAnimationFrame(() => {
        
    })
    */

}

  // ============================================================
  // 點擊 Edge
  // ============================================================

  onEdgeClick(({ edge }) => {

    clearSelectionNode()
    addSelectedEdges([edge])

    })

  
  const duplicateSelected = () => {
    if (selectedNodes.value.length === 0) {
      return
    }

    
    BeforeAction()
    const newNodes = duplicateSelectedNodes()
    console.log("[duplicateSelected]")
    console.log(selectedNodes)
    // Vue Flow 更新 Node selection 後，
    // 下一幀重新取得實際選取狀態

    
    addSelectedNodes(newNodes)

  }

  // ============================================================
  // Delete
  // ============================================================

  const deleteSelected = () => {
    
    if(selectedNodes.value.length > 0 || selectedEdges.value.length > 0){
        BeforeAction()
        console.log("[deleteSelected] pushed!")
    }

    if (selectedNodes.value.length > 0) {
      const node_ids = []

      for(const n of selectedNodes.value){
        node_ids.push(n.id)

      }
      console.log(node_ids)

      deleteNodes(node_ids)

      clearSelectionNode()
      
    }

    if (selectedEdges.value.length > 0) {
      const edge_ids = []

      for(const e of selectedEdges.value){
        edge_ids.push(e.id)

      }

      deleteEdges(edge_ids)

      clearSelectionNode()
      
    }
  }

  return {
  selectedNodes,
  selectedEdges,

  clearSelection: clearSelectionNode,

  duplicateSelected,
  deleteSelected,
  updateSelectionSelectedNodes
}
}