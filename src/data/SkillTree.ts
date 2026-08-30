import type { Node, Edge } from '@vue-flow/core'
export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    width: '64px',
    height: '64px',
    data: {
      label: '核心天賦：基礎體魄',
      icon: 'axe.svg',
      shape: 'rounded-rectangle',

      maxLevel: 2,
      costPerLevel: 1
      
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 128, y: 128 },
    width: '64px',
    height: '64px',
    data: {
      label: '分支 A：力量狂暴',
      icon: 'axe.svg',
      shape: 'circle',

      maxLevel: 1,
      costPerLevel: 1
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: -128, y: 128 },
    width: '64px',
    height: '64px',
    data: {
      label: '分支 B：疾風步',
      icon: 'axe.svg',
      shape: 'square',

      maxLevel: 1,
      costPerLevel: 1
    },
    
  },
]

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    type: 'floating',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'floating',
  },
]