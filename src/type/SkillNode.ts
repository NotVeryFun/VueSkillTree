import type { GraphNode } from '@vue-flow/core'
import type { SkillNodeShape } from '../components/SkillNode.vue'


export interface SkillNodeCustomProperty {
  key : string , 
  value : string
}

export interface SkillNodeData {
// ===== 屬性 =====
  skill_id : string
  label?: string
  description?: string
  maxLevel : number
  costPerLevel : number

  // ===== 樣式 =====
  icon?: string
  backgroundColor?: string
  shape?: SkillNodeShape

  kvs : SkillNodeCustomProperty[]
}

export type SkillGraphNode = GraphNode<SkillNodeData>