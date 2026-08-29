import type { Node, Edge } from '@vue-flow/core'
export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 50 },
    data: {
      label: '核心天賦：基礎體魄',
      icon: 'axe.svg',
      shape: 'rounded-rectangle',

      maxLevel: 2,
      
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 100, y: 200 },
    width: '100px',
    height: '100px',
    data: {
      label: '分支 A：力量狂暴',
      icon: 'axe.svg',
      shape: 'circle',
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 400, y: 200 },
    data: {
      label: '分支 B：疾風步',
      icon: 'axe.svg',
      shape: 'square',
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