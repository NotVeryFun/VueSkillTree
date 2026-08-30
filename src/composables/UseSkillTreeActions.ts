import {
  MarkerType,
  useVueFlow,
  type XYPosition,
} from '@vue-flow/core'

export function useSkillTreeActions() {
  const {
    findNode,
    addNodes,
    addEdges,
    removeNodes,
    removeEdges,
    screenToFlowCoordinate,
    getNodes,
    getEdges,
    setNodes
  } = useVueFlow()

  // ============================================================
  // Node ID
  // ============================================================

  /**
   * 建立不重複的 Node ID
   *
   * skill_1
   * skill_2
   * skill_3
   * ...
   */
  const createNodeId = (
  usedIds?: Set<string>
    ) => {
    let index = 1

    while (
        findNode(`skill_${index}`) ||
        usedIds?.has(`skill_${index}`)
    ) {
        index++
    }

    const id = `skill_${index}`

    usedIds?.add(id)

    return id
    }

  // ============================================================
  // Edge ID
  // ============================================================

  const createEdgeId = (
    sourceId: string,
    targetId: string
  ) => {
    return `e_${sourceId}-${targetId}`
  }

  // ============================================================
  // 從 Handle 新增 Node
  // ============================================================

  const addNodeFromHandle = ({
    sourceId,
    position,
  }: {
    sourceId: string
    position: 'top' | 'bottom' | 'left' | 'right'
  }) => {

    const sourceNode = findNode(sourceId)

    if (!sourceNode) {
      return
    }

    const offset = 180

    let x = sourceNode.position.x
    let y = sourceNode.position.y

    if (position === 'top') {
      y -= offset
    }

    if (position === 'bottom') {
      y += offset
    }

    if (position === 'left') {
      x -= offset
    }

    if (position === 'right') {
      x += offset
    }

    const id = createNodeId()

    addNodes([
      {
        id,
        type: 'custom',

        position: {
          x,
          y,
        },

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
        id: createEdgeId(sourceId, id),

        source: sourceId,
        target: id,

        type: 'floating',

        markerEnd: MarkerType.ArrowClosed,
      },
    ])
  }

  // ============================================================
  // 滑鼠位置新增 Node
  // ============================================================

  const addNodeByMousePosition = (
    e: MouseEvent
  ) => {

    const flowPos: XYPosition =
      screenToFlowCoordinate({
        x: e.clientX,
        y: e.clientY,
      })

    const id = createNodeId()

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

  // ============================================================
  // 複製選取的 Nodes
  // ============================================================

  /**
   * 複製目前選取的所有 Node。
   *
   * Edge 規則：
   *
   * A ──→ B ──→ C
   *
   * 選取 A、B：
   *
   * A ──→ B       ← 複製
   *
   * B ──→ C       ← 不複製
   *
   * 因為只有當 source 與 target
   * 都在選取範圍內時，才複製 Edge。
   */
  const duplicateSelectedNodes = () => {
  const selectedNodes = getNodes.value.filter(
    node => node.selected
  )

  if (selectedNodes.length === 0) {
    return []
  }

  const selectedIds = new Set(
    selectedNodes.map(node => node.id)
  )

  const selectedEdges = getEdges.value.filter(
    edge =>
      selectedIds.has(edge.source) &&
      selectedIds.has(edge.target)
  )

  const idMap = new Map<string, string>()

  const OFFSET = 40

  const newNodes = selectedNodes.map((node, index) => {

    const newId = `node_${Date.now()}_${index}`

    idMap.set(node.id, newId)

    return {
      ...node,

      id: newId,

      position: {
        x: node.position.x + OFFSET,
        y: node.position.y + OFFSET,
      },

      selected: true,

      data: {
        ...node.data,
      },
    }
  })

  const newEdges = selectedEdges.map(edge => ({
    ...edge,

    id: `e_${idMap.get(edge.source)}-${idMap.get(edge.target)}`,

    source: idMap.get(edge.source)!,
    target: idMap.get(edge.target)!,

    selected: false,
  }))

  // 取消舊 Node
  setNodes(
    getNodes.value.map(node => ({
      ...node,
      selected: false,
    }))
  )

  // 建立新 Node
  console.log("[duplicateSelectedNodes] new node : ")
  console.log(newNodes)
  addNodes(newNodes)

  // 建立新 Edge
  if (newEdges.length > 0) {
    addEdges(newEdges)
  }

  // ★ 把新 Node 回傳給 Selection
  return newNodes
}

  // ============================================================
  // 刪除 Node
  // ============================================================

  const deleteNode = (
    nodeId: string
  ) => {
    removeNodes([nodeId])
  }

  // ============================================================
  // 刪除 Edge
  // ============================================================

  const deleteEdge = (
    edgeId: string
  ) => {
    removeEdges([edgeId])
  }

  // ============================================================
  // 批次刪除 Nodes
  // ============================================================

  const deleteNodes = (
    nodeIds: string[]
  ) => {
    removeNodes(nodeIds)
  }

  // ============================================================
  // 批次刪除 Edges
  // ============================================================

  const deleteEdges = (
    edgeIds: string[]
  ) => {
    removeEdges(edgeIds)
  }

  // ============================================================
  // Return
  // ============================================================

  return {
    addNodeFromHandle,
    addNodeByMousePosition,

    duplicateSelectedNodes,

    deleteNode,
    deleteEdge,

    deleteNodes,
    deleteEdges,

    createNodeId,
  }
}