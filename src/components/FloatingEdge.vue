<!-- FloatingEdge.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { getStraightPath, useVueFlow, type EdgeProps } from '@vue-flow/core'

const props = defineProps<EdgeProps>()
const { findNode } = useVueFlow()

// 計算節點矩形外框與連線方向的幾何交點
function getParams(sourceNode: any, targetNode: any) {
  // 取得 Source 節點中心點
  const sourceCenter = {
    x: sourceNode.computedPosition.x + (sourceNode.dimensions.width || 100) / 2,
    y: sourceNode.computedPosition.y + (sourceNode.dimensions.height || 80) / 2,
  }
  // 取得 Target 節點中心點
  const targetCenter = {
    x: targetNode.computedPosition.x + (targetNode.dimensions.width || 100) / 2,
    y: targetNode.computedPosition.y + (targetNode.dimensions.height || 80) / 2,
  }

  // 強制從節點中心向外射線，計算出外框邊緣交點
  const sourceIntersection = getNodeIntersection(sourceNode, targetCenter)
  const targetIntersection = getNodeIntersection(targetNode, sourceCenter)

  return {
    sx: sourceIntersection.x,
    sy: sourceIntersection.y,
    tx: targetIntersection.x,
    ty: targetIntersection.y,
  }
}

function getNodeIntersection(node: any, targetPoint: { x: number; y: number }) {
  const width = node.dimensions.width || 100
  const height = node.dimensions.height || 80
  const { x: nx, y: ny } = node.computedPosition

  const w = width / 2
  const h = height / 2

  const x2 = nx + w
  const y2 = ny + h

  const dx = targetPoint.x - x2
  const dy = targetPoint.y - y2

  if (dx === 0 && dy === 0) return { x: x2, y: y2 }

  const slope = dy / dx
  let x = 0
  let y = 0

  if (Math.abs(dy) < Math.abs(dx) * (h / w)) {
    x = dx > 0 ? w : -w
    y = x * slope
  } else {
    y = dy > 0 ? h : -h
    x = y / slope
  }

  return { x: x2 + x, y: y2 + y }
}

const edgePath = computed(() => {
  const sourceNode = findNode(props.source)
  const targetNode = findNode(props.target)

  if (!sourceNode || !targetNode) {
    return { path: '' }
  }

  const { sx, sy, tx, ty } = getParams(sourceNode, targetNode)

  const [path] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  })

  return { path }
})
</script>

<template>
  <path
    :id="id"
    class="vue-flow__edge-path"
    :d="edgePath.path"
    :marker-end="markerEnd"
    :style="{...style , strokeWidth : 3.5}"
    
  />
</template>