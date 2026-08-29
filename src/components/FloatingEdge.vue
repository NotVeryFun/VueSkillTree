<script setup lang="ts">
import { computed } from 'vue'
import {
  getStraightPath,
  useVueFlow,
  type EdgeProps,
} from '@vue-flow/core'

import {
  getBoundaryPoint,
  type ShapeType,
} from '../utils/ShapeGeometry'


const props = defineProps<EdgeProps>()

const { findNode } = useVueFlow()


const edgePath = computed(() => {

  const sourceNode = findNode(props.source)
  const targetNode = findNode(props.target)

  if (!sourceNode || !targetNode) {
    return {
      path: '',
    }
  }

  // --------------------------------------------------
  // Node 尺寸
  // --------------------------------------------------

  const sourceWidth =
    sourceNode.dimensions.width || 100

  const sourceHeight =
    sourceNode.dimensions.height || 80

  const targetWidth =
    targetNode.dimensions.width || 100

  const targetHeight =
    targetNode.dimensions.height || 80


  // --------------------------------------------------
  // Node 中心
  // --------------------------------------------------

  const sourceCenter = {
    x:
      sourceNode.computedPosition.x +
      sourceWidth / 2,

    y:
      sourceNode.computedPosition.y +
      sourceHeight / 2,
  }

  const targetCenter = {
    x:
      targetNode.computedPosition.x +
      targetWidth / 2,

    y:
      targetNode.computedPosition.y +
      targetHeight / 2,
  }


  // --------------------------------------------------
  // Source → Target 方向
  // --------------------------------------------------

  const dx =
    targetCenter.x -
    sourceCenter.x

  const dy =
    targetCenter.y -
    sourceCenter.y

  const length =
    Math.sqrt(dx * dx + dy * dy)


  if (length === 0) {
    return {
      path: '',
    }
  }


  const direction = {
    x: dx / length,
    y: dy / length,
  }


  // --------------------------------------------------
  // Source Boundary
  // --------------------------------------------------

  const sourcePoint = getBoundaryPoint(
    (sourceNode.data.shape ??
      'rounded-rectangle') as ShapeType,

    sourceCenter,

    direction,

    sourceWidth,

    sourceHeight,
  )


  // --------------------------------------------------
  // Target Boundary
  // --------------------------------------------------

  const targetPoint = getBoundaryPoint(
    (targetNode.data.shape ??
      'rounded-rectangle') as ShapeType,

    targetCenter,

    {
      x: -direction.x,
      y: -direction.y,
    },

    targetWidth,

    targetHeight,
  )


  // --------------------------------------------------
  // 建立 Edge Path
  // --------------------------------------------------

  const [path] = getStraightPath({
    sourceX: sourcePoint.x,
    sourceY: sourcePoint.y,

    targetX: targetPoint.x,
    targetY: targetPoint.y,
  })


  return {
    path,
  }
})
</script>


<template>
  <path
    :id="id"
    class="vue-flow__edge-path"
    :d="edgePath.path"
    :marker-end="markerEnd"
    :style="{
      ...style,
      strokeWidth: 3.5,
    }"
  />
</template>