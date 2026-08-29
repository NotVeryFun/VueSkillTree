import { ref } from 'vue'
import {
  useVueFlow,
  type GraphNode,
  type GraphEdge,
  type NodeDragEvent,
} from '@vue-flow/core'

import { useSkillTreeActions } from './UseSkillTreeActions'



export function useSkillTreeSelection() {
    const {
        onNodeClick,
        onEdgeClick,
        onPaneClick,
        onSelectionDragStop,
        onSelectionEnd,
        getNodes,
        removeSelectedNodes,
        
    } = useVueFlow()

    const {
        //addNodeFromHandle,
        //deleteNode,
        //deleteEdge,
        deleteNodes,
        deleteEdges,
    } = useSkillTreeActions();

    const selectedNodes = ref<GraphNode[]>([])
    const selectedEdges = ref<GraphEdge[]>([])

    const clearSelection = () => {

        
        selectedNodes.value = []
        selectedEdges.value = []
    }
    onNodeClick(({ node }) => {
        removeSelectedNodes(getNodes.value.filter((another_node) => node != another_node));
        selectedNodes.value = [node]
        selectedEdges.value = []
    })

    onEdgeClick(({ edge }) => {
    selectedNodes.value = []
    selectedEdges.value = [edge]
    })

    onPaneClick(() => {
    clearSelection()
    })

    onSelectionDragStop(( e : NodeDragEvent ) => {
        selectedNodes.value = e.nodes;
        //console.log(selectedNodes.value)
    })


    const updateSelectedNodes = () => {
        selectedNodes.value = getNodes.value.filter(
            (node) => node.selected
        )
    }

    onSelectionEnd((e : MouseEvent) => {
        updateSelectedNodes();
        //console.log("[UseSkillTreeSelection] onSelectionEnd!")
    })


    const deleteSelected = () => {
        if (selectedNodes.value.length > 0) {
            const ids: string[] = selectedNodes.value.map(
                (node: { id: string }) => node.id
            )

            deleteNodes(ids)
            clearSelection()
        }

        if (selectedEdges.value.length > 0) {
            const ids: string[] = selectedEdges.value.map(
                (edge : {id : string}) => edge.id
            )

            deleteEdges(ids)
            clearSelection()
        }
    }


    const handleKeyDown = (event: KeyboardEvent) => {
        if (
            event.key !== 'Delete' &&
            event.key !== 'Backspace'
        ) {
            return
        }

        const target = event.target as HTMLElement | null

        // 避免正在輸入文字時觸發刪除 Node
        if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement ||
            target?.isContentEditable
        ) {
            return
        }

        deleteSelected()
    }

return {
    selectedNodes,
    selectedEdges,
    clearSelection,
    handleKeyDown
  }
}