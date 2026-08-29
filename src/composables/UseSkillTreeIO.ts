import { useVueFlow } from '@vue-flow/core'

export function useSkillTreeIO() {
  const {
    toObject,
    setNodes,
    setEdges,
  } = useVueFlow()

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
    a.download = `skill-tree-${Date.now()}.json`

    a.click()

    URL.revokeObjectURL(url)
  }

  const importFromJson = (
    data: {
      nodes: any[]
      edges: any[]
    }
  ) => {
    setNodes(data.nodes)
    setEdges(data.edges)
  }

  return {
    exportToJson,
    importFromJson,
  }
}