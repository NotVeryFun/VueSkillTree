<script setup lang="ts">
import { ref, markRaw , onMounted, onUnmounted } from 'vue'
import {
  MarkerType,
  SelectionMode,
  useVueFlow,
  VueFlow


} from '@vue-flow/core'
import { Background , BackgroundVariant} from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import './style.css'

import SkillNode, { type SkillNodeShape } from './components/SkillNode.vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import FloatingEdge from './components/FloatingEdge.vue'
import SkillNodeTooltip from './components/SkillNodeTooltip.vue'

import {
  initialNodes,
  initialEdges,
} from './data/SkillTree'

import { useSkillConnection } from './composables/UseSkillConnection'
import { useSkillTreeActions } from './composables/UseSkillTreeActions'
import { useSkillTreeIO } from './composables/UseSkillTreeIO'
import { useSkillTreeSidebar } from './composables/UseSkillTreeSidebar'
import { useSkillIcons } from './composables/UseSkillIcons'
import {useSkillTreeSelection} from './composables/UseSkillTreeSelection'
import type { SkillNodeData } from './type/SkillNode.ts'

import { useSkillTreeHistory } from './composables/UseSkillTreeHistory'
import { useSkillTreeKeyboard } from './composables/UseSkillTreeKeyboard'

const nodes = ref(initialNodes)
const edges = ref(initialEdges)

const nodeTypes = {
  custom: markRaw(SkillNode),
}

const edgeTypes = {
  floating: markRaw(FloatingEdge),
}

const {
  undo,
  redo,
  push,
} = useSkillTreeHistory()



let isRestoringHistory = false

const saveHistory = () => {
  if(isRestoringHistory){return;}
    push(
        nodes.value,
        edges.value
    )
}


const {
  start: startSkillConnection,
  
} = useSkillConnection(saveHistory)

const {
  addNodeFromHandle,
  addNodeByMousePosition
  ,
} = useSkillTreeActions(saveHistory)

const {
  exportToJson,
  importFromJson,
  exportGameData
} = useSkillTreeIO()

const {
  isOpen: isSidebarOpen,
  close: closeSidebar,
  toggle: toggleSidebar,
} = useSkillTreeSidebar()

const {
  iconOptions,
  iconUrlMap,
} = useSkillIcons()


const {
  selectedNodes,
  duplicateSelected,
  deleteSelected,
  updateSelectionSelectedNodes
} = useSkillTreeSelection()




const handleUndo = () => {

  const snapshot = undo(
    nodes.value,
    edges.value
  )

  if (!snapshot) {
    return
  }

  isRestoringHistory = true

  nodes.value = snapshot.nodes
  edges.value = snapshot.edges

  isRestoringHistory = false
}

const handleRedo = () => {

  const snapshot = redo(
    nodes.value,
    edges.value
  )

  if (!snapshot) {
    return
  }

  isRestoringHistory = true

  nodes.value = snapshot.nodes
  edges.value = snapshot.edges

  isRestoringHistory = false
}

const {
  handleKeyDown,
} = useSkillTreeKeyboard({
  duplicateSelected,
  deleteSelected,
  undo: handleUndo,
  redo: handleRedo,
})


const {
    getIntersectingNodes,
    screenToFlowCoordinate
  } = useVueFlow()

const tooltip = ref<SkillTooltipState>({
  visible: false,
  x: 0,
  y: 0,
  node: null,
})




interface SkillTooltipData {
  id: string
  label?: string
  description?: string
  icon?: string
  backgroundColor?: string
  shape?: SkillNodeShape
  maxLevel?: number
  costPerLevel?: number
  currentLevel?: number
}

interface SkillTooltipState {
  visible: boolean
  x: number
  y: number
  node: SkillTooltipData | null
}

const handleNodeHover = (payload: {
  nodeId: string
  event: PointerEvent
}) => {
  const { nodeId, event } = payload

  const node = nodes.value.find(
    (node: { id: string }) => node.id === nodeId
  ) 

  if (!node) {
    return
  }

  tooltip.value = {
    visible: true,
    x: event.clientX + 15,
    y: event.clientY + 15,

    node: {
      id: node.id,
      label: node.data.label,
      description: node.data.description,
      icon: node.data.icon,
      backgroundColor: node.data.backgroundColor,
      shape: node.data.shape,
      maxLevel: node.data.maxLevel,
      costPerLevel: node.data.costPerLevel,
      currentLevel: node.data.currentLevel,
    },
  }
}



const handleNodeLeave = () => {
  tooltip.value.visible = false
}

const presetColors = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#84cc16',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#ec4899',
]





onMounted(() => {
    window.addEventListener(
        'keydown',
        handleKeyDown,{
  capture: true,
}
    )
    window.addEventListener(
      'dblclick',
      handleDoubleClick
    )
})

onUnmounted(() => {
    window.removeEventListener(
        'keydown',
        handleKeyDown
    )
    window.removeEventListener(
      'dblclick',
      handleDoubleClick
    )
})



const updateSelectedNodes = (
  property: keyof SkillNodeData,
  value: string
) => {


  selectedNodes.value.forEach(node => {
    node.data[property] = value as never
  })
}

const updateSelectedNodesNumberProperty = (
  property: keyof SkillNodeData,
  value: number
) => {
  selectedNodes.value.forEach(node => {
    node.data[property] = value as never
  })
}

const shapeOptions = [
  {
    value: 'rounded-rectangle',
    label: '圓角矩形',
  },
  {
    value: 'square',
    label: '正方形',
  },
  {
    value: 'circle',
    label: '圓形',
  },
] satisfies {
  value: SkillNodeShape
  label: string
}[]




const handleDoubleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  const coords = screenToFlowCoordinate({x : event.clientX , y : event.clientY})

  // 只允許空白 Pane
  if (!target.closest('.vue-flow__pane') || getIntersectingNodes({
    x : coords.x,
    y : coords.y,
    width : 1,
    height : 1
  }).length >= 1) {
    return
  }


  saveHistory();
  addNodeByMousePosition(event)
}

const updateNodeId = (newId: string) => {
  const trimmedId = newId.trim()

  if (!trimmedId) {
    return
  }

  const selectedIds =  new Set();


  for(const node of selectedNodes.value){
    selectedIds.add(node.id)
  }

  const duplicated = nodes.value.some(
    node =>
      node.id === trimmedId &&
      !selectedIds.has(node.id)
  )

  if (duplicated) {
    alert(`Node ID「${trimmedId}」已經存在。`)
    return
  }

  selectedNodes.value.forEach(node => {
    node.id = trimmedId
  })
}
</script>

<template>
  <div class="fixed inset-0 flex flex-col overflow-hidden bg-slate-900 font-sans">

    <Navbar
      @toggle-sidebar="toggleSidebar"
      @export-json="exportToJson"
      @export-game-data="exportGameData"
      @import-json="importFromJson"
    />

    <Sidebar
      :is-open="isSidebarOpen"
      :nodes="selectedNodes"
      :selected-nodes="selectedNodes"
      :icon-options="iconOptions"
      :preset-colors="presetColors"
      :icon-url-map="iconUrlMap"
      :shape-options="shapeOptions"
      @close="closeSidebar"
      @update-property = "updateSelectedNodes"
      @update-property-number = "updateSelectedNodesNumberProperty"
      @update-node-id="updateNodeId"
      
    />
    <div ref="flowContainer" class="w-full h-full">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :edge-types="edgeTypes"
        :default-edge-options="{
          type: 'floating',
          markerEnd: MarkerType.ArrowClosed
        }"
        fit-view-on-init
        
        class="w-full h-full"

        :pan-on-drag="[1]"

        :selection-mode="SelectionMode.Partial"
        :selection-on-drag="false"
        :selection-key-code="true"

        :elements-selectable="false"
        :nodes-focusable="false"



        :zoom-on-double-click="false"


        :snap-to-grid="true"
        :snap-grid="[32, 32]"
      >
        <template #node-custom="nodeProps">
          <SkillNode
            v-bind="nodeProps"
            @add-node-from-handle="addNodeFromHandle"
            @start-skill-connection="startSkillConnection"
            @hover="handleNodeHover"
            @leave="handleNodeLeave"
            @select="updateSelectionSelectedNodes"
            
          />
        </template>
        <Background 
        :variant="BackgroundVariant.Dots"
        :gap="64"
        :size="5"
        
        />
      </VueFlow>
      <SkillNodeTooltip
        :visible="tooltip.visible"
        :x="tooltip.x"
        :y="tooltip.y"
        :label="tooltip.node?.label"
        :description="tooltip.node?.description"

        :cost-per-level="tooltip.node?.costPerLevel"
        :max-level="tooltip.node?.maxLevel"
        :current-level="tooltip.node?.currentLevel"
      />
    </div>

  </div>
</template>

<style scoped>
body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
:deep(.vue-flow__selection) {
  background-color: rgba(59, 130, 246, 0.12) !important;
  border: 1.5px dashed #60a5fa !important;
  border-radius: 6px !important;
}
:deep(.vue-flow__nodesselection-rect),
:deep(.vue-flow__nodesselection) {
  display: none !important;
  pointer-events: none !important;
}
</style>