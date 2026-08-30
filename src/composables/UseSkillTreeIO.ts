import { useVueFlow, type GraphEdge, type GraphNode } from '@vue-flow/core'

interface SkillGameNode {
  id: string

  position: {
    x: number
    y: number
  }

  width?: number
  height?: number

  label?: string
  description?: string

  maxLevel?: number
  costPerLevel?: number

  prerequisites: string[]
}

export function useSkillTreeIO() {
  const {
    toObject,
    setNodes,
    setEdges,
    getNodes,
    getEdges,
  } = useVueFlow()

  // ============================================================
  // Vue Flow 編輯器資料
  // ============================================================

  const exportToJson = () => {
    const flowObject = toObject()

    const json = JSON.stringify(
      flowObject,
      null,
      2
    )

    const blob = new Blob(
      [json],
      { type: 'application/json' }
    )

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url
    a.download = `skill-tree-editor-${Date.now()}.json`

    a.click()

    URL.revokeObjectURL(url)
  }

  // ============================================================
  // 匯入 Vue Flow 編輯器資料
  // ============================================================

  const importFromJson = (
    data: {
      nodes: any[]
      edges: any[]
    }
  ) => {
    setNodes(data.nodes)
    setEdges(data.edges)
  }

  // ============================================================
  // 建立 Skill Tree Topology
  //
  // Edge:
  //
  // A → B
  //
  // 轉換成：
  //
  // B.prerequisites = ["A"]
  //
  // 使用 Kahn's Algorithm / BFS
  // ============================================================

const buildRequirements = (
  nodes: GraphNode[],
  edges: GraphEdge[],
) => {
  const nodeMap = new Map(nodes.map(node => [node.id, node]))
  const indegree = new Map<string, number>()
  const requirements = new Map<string, string[]>()
  
  // ⭐️ 建立鄰接表 (source -> targets)，優化 Kahn 演算法效率至 O(V + E)
  const adjList = new Map<string, string[]>()

  // 初始化
  for (const node of nodes) {
    indegree.set(node.id, 0)
    requirements.set(node.id, [])
    adjList.set(node.id, [])
  }

  // 建立 dependency 與 adjList
  for (const edge of edges) {
    if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) {
      throw new Error(`Edge ${edge.id} 指向不存在的 Node`)
    }

    requirements.get(edge.target)!.push(edge.source)
    adjList.get(edge.source)!.push(edge.target)

    indegree.set(
      edge.target,
      indegree.get(edge.target)! + 1
    )
  }

  // ============================================================
  // Kahn BFS
  // ============================================================

  const queue: string[] = []

  for (const [nodeId, degree] of indegree) {
    if (degree === 0) {
      queue.push(nodeId)
    }
  }

  const visited = new Set<string>()
  let index = 0

  while (index < queue.length) {
    const currentId = queue[index++]
    visited.add(currentId)

    // ⭐️ 直接從鄰接表取得受影響的 target，無需走訪全體 edges
    const neighbors = adjList.get(currentId) || []
    for (const targetId of neighbors) {
      const newDegree = indegree.get(targetId)! - 1
      indegree.set(targetId, newDegree)

      if (newDegree === 0) {
        queue.push(targetId)
      }
    }
  }

  // ============================================================
  // Cycle detection
  // ============================================================

  if (visited.size !== nodes.length) {
    const cycleNodes = nodes
      .filter(node => !visited.has(node.id))
      .map(node => node.id)
    
    // ⭐️ 修正訊息呈現：避免使用 ' -> ' 讓使用者誤解為依賴順序
    const errorMsg = `技能樹存在循環依賴，以下節點無法解析：\n\n${cycleNodes.join(', ')}`
    
    alert(errorMsg)
    throw new Error(errorMsg)
  }

  return requirements
}
  // ============================================================
  // 匯出遊戲資料
  // ============================================================

  const exportGameData = () => {

    const nodes = getNodes.value
    const edges = getEdges.value

    // ----------------------------------------------------------
    // 建立 topology
    // ----------------------------------------------------------

    const prerequisites =
      buildRequirements(
        nodes,
        edges
      )

    // ----------------------------------------------------------
    // 建立遊戲 Node
    // ----------------------------------------------------------

    const gameNodes: SkillGameNode[] =
      nodes.map(node => {

        const nodePrerequisites =
          prerequisites.get(node.id) ?? []

        return {

          id: node.id,

          position: {
            x: node.position.x,
            y: node.position.y,
          },

          width:
            node.dimensions.width,

          height:
            node.dimensions.height,

          label:
            node.data.label,

          description:
            node.data.description,

          maxLevel:
            node.data.maxLevel,

          costPerLevel:
            node.data.costPerLevel,

          prerequisites:
            nodePrerequisites,
        }
      })

    // ----------------------------------------------------------
    // 最終遊戲資料
    // ----------------------------------------------------------

    const exportData = {

      version: 1,

      nodes: gameNodes,

    }

    // ----------------------------------------------------------
    // JSON
    // ----------------------------------------------------------

    const json = JSON.stringify(
      exportData,
      null,
      2
    )

    const blob = new Blob(
      [json],
      {
        type: 'application/json'
      }
    )

    const url =
      URL.createObjectURL(blob)

    const a =
      document.createElement('a')

    a.href = url

    a.download =
      `skill-tree-game-${Date.now()}.json`

    a.click()

    URL.revokeObjectURL(url)
  }

  return {
    exportToJson,
    importFromJson,
    exportGameData,
  }
}