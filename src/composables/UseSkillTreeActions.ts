import { MarkerType, useVueFlow, type XYPosition } from '@vue-flow/core'

export function useSkillTreeActions() {
  const {
    findNode,
    addNodes,
    addEdges,
    removeNodes,
    removeEdges,
    screenToFlowCoordinate
  } = useVueFlow()

  const addNodeFromHandle = ({
    sourceId,
    position,
  }: {
    sourceId: string
    position: 'top' | 'bottom' | 'left' | 'right'
  }) => {
    const sourceNode = findNode(sourceId)

    if (!sourceNode) return

    const offset = 180

    let x = sourceNode.position.x
    let y = sourceNode.position.y

    if (position === 'top') y -= offset
    if (position === 'bottom') y += offset
    if (position === 'left') x -= offset
    if (position === 'right') x += offset

    const id = `node_${Date.now()}`

    addNodes([
      {
        id,
        type: 'custom',
        position: { x, y },
        data: {
          label: '新天賦節點',
          icon: 'axe.svg',
          maxLevel: 1,
          costPerLevel: 1,
          
        },
      },
    ])

    addEdges([
      {
        id: `e_${sourceId}-${id}`,
        source: sourceId,
        target: id,
        type: 'floating',
        markerEnd: MarkerType.ArrowClosed,
      },
    ])
  }

  const addNodeByMousePosition = (e : MouseEvent) =>{
    let ScreenX = e.clientX;
    let ScreenY = e.clientY;
    let flowPos : XYPosition = screenToFlowCoordinate({x : ScreenX , y : ScreenY});

    const id = `node_${Date.now()}`

    addNodes([
      {
        id,
        type: 'custom',
        position: flowPos,
        data: {
          label: '新天賦節點',
          icon: 'axe.svg',
          maxLevel: 1,
          costPerLevel: 1,
          
        },
      },
    ])
  }


  const deleteNode = (nodeId: string) => {
    removeNodes([nodeId])
  }

  const deleteEdge = (edgeId: string) => {
    removeEdges([edgeId])
  }

const deleteNodes = (nodeId: string[]) => {
    removeNodes(nodeId)
  }

  const deleteEdges = (edgeIds: string[]) => {
    removeEdges(edgeIds)
  }

  

  return {
    addNodeFromHandle,
    deleteNode,
    deleteEdge,
    deleteNodes , 
    deleteEdges,
    addNodeByMousePosition
  }

}