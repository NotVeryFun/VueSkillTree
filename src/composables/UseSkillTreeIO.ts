import { useVueFlow, type GraphEdge, type GraphNode } from '@vue-flow/core'
import type { SkillGraphNode, SkillNodeData } from '../type/SkillNode'
import type { ImportTSVDataSettings } from '@/type/ImportTSVSettings'


type SkillNodeSaveData  = {
  //Node stype , ID...原本就在Node中的資訊
  id: string

  position: {
    x: number
    y: number
  }

  width?: number
  height?: number


  //SkillNodeData

  //after processing
  prerequisites: string[]
} & SkillNodeData

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
      nodes: SkillGraphNode[]
      edges: GraphEdge[]
    }
  ) => {
    setNodes(data.nodes)
    setEdges(data.edges)
  }


  function importTSVData(
    data : ImportTSVDataSettings
  ){

    const nodes : GraphNode<SkillNodeData>[] = getNodes.value;
    const rows = data.data
    // awful O(n^2) code
    const max_len = Object.entries(rows[0]).length
    console.log("max_len : " , max_len)
    console.log(Object.entries(rows[0]))
    for(const n of nodes){
      for(const r of rows){
        if(n.data.skill_id != undefined && n.data.skill_id == r[0]){
          console.log(r)
          if(data.column_number_skill_name >= 0){
            n.data.label = r[data.column_number_skill_name - 1];
          }

          if(data.column_number_skill_description >= 0){
            n.data.description = r[data.column_number_skill_description - 1];
          }

          if(data.column_number_skill_cost_per_level >= 0){
            n.data.costPerLevel = Number(r[data.column_number_skill_cost_per_level - 1]);
          }

          if(data.column_number_skill_max_level >= 0){
            n.data.maxLevel = Number(r[data.column_number_skill_max_level - 1]);
          }

          if(data.column_number_skill_kvs_start >= 0){
            n.data.kvs = []
            const start_idx = data.column_number_skill_kvs_start - 1;
            for(let i = start_idx ; i < max_len ; i++){
              const str = r[i]
              //console.log("[UseSkillTreeIO] str : " , str)
              if(str.trim() == ''){continue}
              //沒有冒號的情況，kv同等
              if(str.includes(":")){
                const splited = str.split(':');
                const k = splited[0];
                const v = splited[1];
                
                n.data.kvs.push({key : k , value : v})

              }else{
                n.data.kvs.push({key : str , value : ""})
              }
            }
          }
          
        }
      }
    }
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
  nodes: SkillGraphNode[],
  edges: GraphEdge[],
) => {
  const nodeMap = new Map(nodes.map(node => [node.id, node]))
  const indegree = new Map<string, number>()
  const requirements = new Map<string, string[]>()
  const NodeIdToSkillId = new Map(nodes.map(node => [node.id, node.data.skill_id]))
  // ⭐️ 建立鄰接表 (source -> targets)，優化 Kahn 演算法效率至 O(V + E)
  const adjList = new Map<string, string[]>()

  // 初始化
  for (const node of nodes) {
    indegree.set(node.data.skill_id, 0)
    requirements.set(node.data.skill_id, [])
    adjList.set(node.data.skill_id, [])
  }

  // 建立 dependency 與 adjList
  for (const edge of edges) {
    if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) {
      throw new Error(`Edge ${edge.id} 指向不存在的 Node`)
    }
    const edge_target_skillId = NodeIdToSkillId.get(edge.target);
    const edge_source_skillId = NodeIdToSkillId.get(edge.source);

    if(edge_target_skillId == undefined || edge_source_skillId == undefined){throw new Error(`Edge Target : ${edge_target_skillId} , Source ${edge_source_skillId} 發生錯誤`) ;}
    requirements.get(edge_target_skillId)!.push(edge_source_skillId)
    adjList.get(edge_source_skillId)!.push(edge_target_skillId)

    indegree.set(
      edge_target_skillId,
      indegree.get(edge_target_skillId)! + 1
    )
  }

  // ============================================================
  // Kahn BFS
  // ============================================================

  const queue: string[] = [] // skillId

  for (const [nodeId, degree] of indegree) {
    if (degree === 0) {
      queue.push(nodeId)
    }
  }

  const visited = new Set<string>() // skillId
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
  console.table(
    Array.from(requirements, ([skillId, requiredSkills]) => ({
      skillId,
      requirements: requiredSkills.join(", "),
    }))
  )

  // ============================================================
  // Cycle detection
  // ============================================================

  if (visited.size !== nodes.length) {
    const cycleNodes = nodes
      .filter(node => !visited.has(node.data.skill_id))
      .map(node => node.data.skill_id)
    
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

    const nodes = getNodes.value as GraphNode<SkillNodeSaveData>[]
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
      
    const gameNodes: SkillNodeSaveData[] =
      nodes.map(node => {

        const nodePrerequisites =
          prerequisites.get(node.data.skill_id) ?? []

        return {

          id: node.id,
          skill_id: node.data.skill_id,

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

          kvs : node.data.kvs
        }
      })

    // ----------------------------------------------------------
    // 最終遊戲資料
    // ----------------------------------------------------------

    const exportData = {

      version: 2,

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

    importTSVData
  }
}