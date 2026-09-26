import { useVueFlow, type GraphNode } from '@vue-flow/core'
import { getNodeSize, snapPosition, topLeftToCenter } from '../utils/grid'

/** 把節點中心吸回格子 (VueFlow v1 只吸左上角,這裡做最終校正) */
export function snapNodeCenterToGrid(node: Pick<GraphNode, 'position' | 'dimensions' | 'width' | 'height'>) {
  const size = getNodeSize(node)
  const center = topLeftToCenter(node.position, size.width, size.height)
  const snapped = snapPosition(center)
  node.position.x = snapped.x - size.width / 2
  node.position.y = snapped.y - size.height / 2
}

/** 註冊拖曳結束後的中心校正,回傳 snap 函式供測試/手動呼叫 */
export function useCenterSnap() {
  const { onNodeDragStop, onSelectionDragStop } = useVueFlow()

  onNodeDragStop(({ node }) => {
    snapNodeCenterToGrid(node)
  })

  onSelectionDragStop(({ nodes: draggedNodes }) => {
    for (const node of draggedNodes ?? []) {
      snapNodeCenterToGrid(node)
    }
  })

  return { snapNodeCenterToGrid }
}
