import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'

export function useSkillTreeSidebar() {
  const { onNodeClick } = useVueFlow()

  const isOpen = ref(false)

  onNodeClick(() => {
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
    close,
    toggle,
  }
}