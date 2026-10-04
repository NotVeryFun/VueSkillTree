import type { Node, Edge, XYPosition } from '@vue-flow/core'
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from '../utils/grid'
export function makeDefaultNode(id : string , position : XYPosition) {
  
    return {id,

    type: 'custom',
    width: DEFAULT_NODE_WIDTH,
    height: DEFAULT_NODE_HEIGHT,

    position: position,

    data: {
      label: 'New Skill',
      icon: '_1_Game/axe.svg',

      maxLevel: 1,
      costPerLevel: 1,
      
    }}
      


}
export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    width: DEFAULT_NODE_WIDTH,
    height: DEFAULT_NODE_HEIGHT,
    data: {
      skill_id: '11',
      label: 'Attacker',
      
      icon: '_1_Game/axe.svg',
      description: 'Damage +10%',
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
      label: 'Big Attacker',
      icon: '_1_Game/axe.svg',
      description: 'some +30% Damage',
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
      label: 'Swiftness',
      icon: '_1_Game/axe.svg',
      description: '+30% Attack Speed',
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