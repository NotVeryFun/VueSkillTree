import type { GraphNode } from '@vue-flow/core'
import type { SkillNodeShape } from '../components/SkillNode.vue'

export interface SkillNodeData {
// ===== 屬性 =====
  label?: string
  description?: string
  maxLevel : number
  costPerLevel : number

  // ===== 樣式 =====
  icon?: string
  backgroundColor?: string
  shape?: SkillNodeShape
}

export type SkillGraphNode = GraphNode<SkillNodeData>