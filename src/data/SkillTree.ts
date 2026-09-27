import type { Node, Edge } from '@vue-flow/core'
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from '../utils/grid'

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    width: DEFAULT_NODE_WIDTH,
    height: DEFAULT_NODE_HEIGHT,
    data: {
      skill_id: '11',
      label: '核心天賦：基礎體魄',
      icon: 'axe.svg',
      shape: 'rounded-rectangle',

      maxLevel: 2,
      costPerLevel: 1,
      kvs : []
      
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: -256, y: -256 },
    width: DEFAULT_NODE_WIDTH,
    height: DEFAULT_NODE_HEIGHT,
    data: {
      skill_id: '12',
      label: '分支 A：力量狂暴',
      icon: 'axe.svg',
      shape: 'circle',

      maxLevel: 1,
      costPerLevel: 1,
      kvs : []
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 256, y: -256 },
    width: DEFAULT_NODE_WIDTH,
    height: DEFAULT_NODE_HEIGHT,
    data: {
      skill_id: '13',
      label: '分支 B：疾風步',
      icon: 'axe.svg',
      shape: 'square',

      maxLevel: 1,
      costPerLevel: 1,
      kvs : []
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
    animated: true,
    type: 'floating',
  },
]