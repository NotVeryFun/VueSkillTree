import { MarkerType, Position, useVueFlow} from '@vue-flow/core'
import { cloneNode } from './useNodeClone'
import type { SkillGraphNode } from '@/type/SkillNode'

export function useSkillConnection(
  onBeforeAddEdge?: () => void

) {
  const {
    addEdges,
    startConnection,
    updateConnection,
    endConnection,
    getIntersectingNodes,
    screenToFlowCoordinate,
    getConnectedEdges,
    findNode,
    
    removeSelectedNodes,
    addNodes
  } = useVueFlow()



  let connectionSourceId: string | null = null
  //let connectionPointerId: number | null = null
  let connectionTargetId: string | null = null
  const getNodeUnderPointer = (event: PointerEvent) => {
    const flowPosition = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const nodes = getIntersectingNodes({
      x: flowPosition.x,
      y: flowPosition.y,
      width: 1,
      height: 1,
    })

    return nodes[0]?.id ?? null
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (!connectionSourceId) return

    const targetId = getNodeUnderPointer(event)

    updateConnection({
      x: event.clientX,
      y: event.clientY,
    })


    if (!targetId || targetId === connectionSourceId) {
      connectionTargetId = null
      return
    }

    connectionTargetId = targetId
  }

  const cleanup = () => {
    window.removeEventListener(
      'pointermove',
      handlePointerMove
    )

    connectionSourceId = null
    //connectionPointerId = null
    connectionTargetId = null
  }

  const handlePointerUp = (e : PointerEvent) => {
    const sourceId = connectionSourceId
    const targetId = connectionTargetId

    try {
      endConnection()
    }catch{

    }

    

    cleanup()

    if (!sourceId) return

    if(!targetId){
      const sourceNode = findNode(sourceId) as SkillGraphNode
      if(sourceNode.width == undefined || sourceNode.height == undefined){return} //type check
      onBeforeAddEdge?.()
      const coords = screenToFlowCoordinate({
        x : e.clientX - (sourceNode.width as number) / 2, 
        y : e.clientY - (sourceNode.height as number) / 2})
      const new_node = cloneNode(sourceNode , coords)
      
      removeSelectedNodes([sourceNode])
      addNodes([new_node])
      return
    }

    if (sourceId === targetId) return

    const edges_target = getConnectedEdges(targetId)
    const edges_source = getConnectedEdges(sourceId)



    //console.log(edges_source.find(es => edges_target.find(et => et.id == es.id)))
    if(edges_source.find(es => edges_target.find(et => et.id == es.id)) != undefined){
      console.log("[Connect] Connection Found!")
      return;
    }
    console.log("[Connect] Connection Not Found!")

    console.log(sourceId)
    console.log(edges_source)
    console.log(targetId)
    console.log(edges_target)


    onBeforeAddEdge?.();


    addEdges([
      {
        id: `e-${sourceId}-${targetId}-${Date.now()}`,
        source: sourceId,
        target: targetId,
        sourceHandle: 'center-source',
        targetHandle: 'center-target',
        type: 'floating',
        markerEnd: MarkerType.ArrowClosed,
        animated: true
        
      },
    ])
  }

  const start = ({
    sourceId,
    event,
  }: {
    sourceId: string
    event: PointerEvent
  }) => {
    if (event.button !== 0) return

    connectionSourceId = sourceId
    //connectionPointerId = event.pointerId
    connectionTargetId = null

    startConnection(
      {
        nodeId: sourceId,
        type: 'source',
        id: 'center-source',
        position: Position.Top,
        x: event.clientX,
        y: event.clientY,
      },
      {
        x: event.clientX,
        y: event.clientY,
      },
      false
    )

    window.addEventListener(
      'pointermove',
      handlePointerMove
    )

    window.addEventListener(
      'pointerup',
      handlePointerUp,
      { once: true }
    )
  }



  return {
    start,
  }
}