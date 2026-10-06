import {
  MarkerType,
  useVueFlow,
  type XYPosition,
} from '@vue-flow/core'
import {
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
  DUPLICATE_OFFSET,
  NEW_NODE_OFFSET,
  getNodeSize,
  snapCenterToTopLeft,
  snapPosition,
  topLeftToCenter,
} from '../utils/grid'
import type { SkillGraphNode, SkillNodeCustomProperty } from '../type/SkillNode'
import { makeDefaultNode } from '../data/SkillTree'
import { cloneNode } from './useNodeClone'

export function useSkillTreeActions(
  onBeforeChange?: () => void

) {
  const {
    findNode,
    addNodes,
    addEdges,
    removeNodes,
    removeEdges,
    removeSelectedNodes,
    screenToFlowCoordinate,
    getNodes,
    getEdges  } = useVueFlow()

  

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

    const sourceNode = findNode(sourceId) as SkillGraphNode

    if (!sourceNode) {
      return
    }

    // VueFlow v1 position = 左上角,先換算出 source 中心,
    // 再用中心 + 偏移決定新節點中心,最後吸附回左上角
    const sourceSize = getNodeSize(sourceNode)
    const sourceCenter = topLeftToCenter(
      sourceNode.position,
      sourceSize.width,
      sourceSize.height,
    )

    const targetCenter: XYPosition = { ...sourceCenter }

    if (position === 'top') {
      targetCenter.y -= NEW_NODE_OFFSET
    }

    if (position === 'bottom') {
      targetCenter.y += NEW_NODE_OFFSET
    }

    if (position === 'left') {
      targetCenter.x -= NEW_NODE_OFFSET
    }

    if (position === 'right') {
      targetCenter.x += NEW_NODE_OFFSET
    }

    const snappedTopLeft = snapCenterToTopLeft(
      targetCenter,
      DEFAULT_NODE_WIDTH,
      DEFAULT_NODE_HEIGHT,
    )


    onBeforeChange?.()
    const newNode = cloneNode(sourceNode , snappedTopLeft)
    addNodes([
      newNode
    ])
    removeSelectedNodes([sourceNode]);

    addEdges([
      {
        id: createEdgeId(sourceId, newNode.id),

        source: sourceId,
        target: newNode.id,

        type: 'floating',

        markerEnd: MarkerType.ArrowClosed,
        animated: true
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

    // 滑鼠點 = 期望的中心點,吸附後再換算回左上角
    const snappedTopLeft = snapCenterToTopLeft(
      flowPos,
      DEFAULT_NODE_WIDTH,
      DEFAULT_NODE_HEIGHT,
    )

    const id = createNodeId()

    const newNode = makeDefaultNode(id , snappedTopLeft)
    onBeforeChange?.()
    addNodes([
      newNode
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
    const newNodes = selectedNodes.map((node, index) => {
      
      const newId = `node_${Date.now()}_${index}`

      idMap.set(node.id, newId)

      // 舊中心 + 位移 -> 吸附 -> 換算回左上角,保持中心對齊
      const size = getNodeSize(node)
      const oldCenter = topLeftToCenter(node.position, size.width, size.height)
      const newCenter = snapPosition({
        x: oldCenter.x + DUPLICATE_OFFSET,
        y: oldCenter.y + DUPLICATE_OFFSET,
      })

      return {
        ...node,

        id: newId,

        position: {
          x: newCenter.x - size.width / 2,
          y: newCenter.y - size.height / 2,
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
      animated: true
    }))



    onBeforeChange?.()
    // 取消舊 Node
    removeSelectedNodes(selectedNodes);

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