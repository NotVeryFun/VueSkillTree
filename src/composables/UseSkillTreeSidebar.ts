import { ref } from 'vue'
import { useVueFlow, type GraphNode } from '@vue-flow/core'

export function useSkillTreeSidebar() {
  const { onNodeClick } = useVueFlow()

  const isOpen = ref(false)
  const selectedNode = ref<GraphNode | null>(null)

  onNodeClick(({ node }) => {
    selectedNode.value = node
    isOpen.value = true
  })

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    selectedNode,
    close,
    toggle,
  }
}