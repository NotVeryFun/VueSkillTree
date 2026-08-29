// SkillNodeShapes.ts

import type { SkillNodeShape } from '../components/SkillNode.vue'

export const shapeOptions: {
  value: SkillNodeShape
  label: string
}[] = [
  {
    value: 'rounded-rectangle',
    label: '圓角矩形',
  },
  {
    value: 'square',
    label: '正方形',
  },
  {
    value: 'circle',
    label: '圓形',
  },
]