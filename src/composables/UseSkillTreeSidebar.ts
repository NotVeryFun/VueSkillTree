import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'

export function useSkillTreeSidebar() {
  const { onNodeClick } = useVueFlow()

  return {
    close,
  }
}