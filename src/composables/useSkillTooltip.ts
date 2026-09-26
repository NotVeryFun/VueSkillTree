import { ref } from 'vue'
import type { GraphNode } from '@vue-flow/core'
import type { SkillNodeData } from '../type/SkillNode'

export interface SkillTooltipState {
  visible: boolean
  x: number
  y: number
  node: {
    id: string
    label?: string
    description?: string
    maxLevel?: number
    costPerLevel?: number
    currentLevel?: number
  } | null
}

/**
 * Tooltip 狀態管理。
 * 由 VueFlow 原生 node-mouse-enter/move/leave 事件驅動,
 * 不再經由 SkillNode 自製 hover/leave emit。
 */
export function useSkillTooltip() {
  const tooltip = ref<SkillTooltipState>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  })

  const showForNode = (node: GraphNode<SkillNodeData>, clientX: number, clientY: number) => {
    tooltip.value = {
      visible: true,
      x: clientX + 15,
      y: clientY + 15,
      node: {
        id: node.id,
        label: node.data?.label,
        description: node.data?.description,
        maxLevel: node.data?.maxLevel,
        costPerLevel: node.data?.costPerLevel,
        currentLevel: (node.data as { currentLevel?: number })?.currentLevel,
      },
    }
  }

  const hide = () => {
    tooltip.value.visible = false
  }

  return { tooltip, showForNode, hide }
}
