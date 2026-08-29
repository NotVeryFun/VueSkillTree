import { MarkerType, Position, useVueFlow } from '@vue-flow/core'

export function useSkillConnection() {
  const {
    addEdges,
    startConnection,
    updateConnection,
    endConnection,
    getIntersectingNodes,
    screenToFlowCoordinate,
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

  const handlePointerUp = () => {
    const sourceId = connectionSourceId
    const targetId = connectionTargetId

    try {
      endConnection()
    } catch {}

    cleanup()

    if (!sourceId || !targetId) return
    if (sourceId === targetId) return

    addEdges([
      {
        id: `e-${sourceId}-${targetId}-${Date.now()}`,
        source: sourceId,
        target: targetId,
        sourceHandle: 'center-source',
        targetHandle: 'center-target',
        type: 'floating',
        markerEnd: MarkerType.ArrowClosed,
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