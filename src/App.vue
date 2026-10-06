<script setup lang="ts">
import { ref, markRaw , onMounted, onUnmounted, computed } from 'vue'
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
import FloatingEdge from './components/FloatingEdge.vue'
import SkillNodeTooltip from './components/SkillNodeTooltip.vue'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import {
  initialNodes,
  initialEdges,
} from './data/SkillTree'

import { useSkillConnection } from './composables/UseSkillConnection'
import { useSkillTreeActions } from './composables/UseSkillTreeActions'
import { useSkillTreeIO } from './composables/UseSkillTreeIO'
import { useSkillIcons } from './composables/UseSkillIcons'
import {useSkillTreeSelection} from './composables/UseSkillTreeSelection'

import { useSkillTreeHistory } from './composables/UseSkillTreeHistory'
import { useSkillTreeKeyboard } from './composables/UseSkillTreeKeyboard'
import {
  BACKGROUND_GAP,
  SNAP_GRID,
} from './utils/grid'
import NodePropertySidebar from './components/NodePropertySidebar.vue'
import Sidebar from './components/ui/sidebar/Sidebar.vue'
import SidebarProvider from './components/ui/sidebar/SidebarProvider.vue'
import SidebarContent from './components/ui/sidebar/SidebarContent.vue'
import SidebarGroup from './components/ui/sidebar/SidebarGroup.vue'
import SidebarGroupContent from './components/ui/sidebar/SidebarGroupContent.vue'
import SidebarMenu from './components/ui/sidebar/SidebarMenu.vue'
import SidebarMenuItem from './components/ui/sidebar/SidebarMenuItem.vue'

const nodes = ref(initialNodes)
const edges = ref(initialEdges)

const nodeTypes = {
  custom: markRaw(SkillNode),
}

const edgeTypes = {
  floating: markRaw(FloatingEdge),
}
const {
    getIntersectingNodes,
    screenToFlowCoordinate,
    onNodesChange
  } = useVueFlow()


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
  importTSVData,
  exportGameData

} = useSkillTreeIO()

const {
  iconOptions,
  iconUrlMap,
} = useSkillIcons()



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
    tooltip.value.visible = false
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


//tooltip被刪除掉之後，發現自己沒有雨Node重疊
onNodesChange((changes) => {
  for(const change of changes){
    if(change.type == 'remove'){
      if(tooltip.value.node && tooltip.value.node.id == change.id){
        tooltip.value.visible = false;
      }
    }
  }
})

const {
  selectedNodes,
  duplicateSelected,
  deleteSelected,
  updateSelectionSelectedNodes
} = useSkillTreeSelection(saveHistory)




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


const presetColors = [
  '#dc2626', // Red
  '#ea580c', // Red-Orange
  '#f97316', // Orange
  '#d97706', // Amber
  '#ca8a04', // Yellow
  '#84a600', // Lime
  '#65a30d', // Green-Yellow
  '#16a34a', // Green
  '#059669', // Emerald
  '#0d9488', // Teal
  '#0891b2', // Cyan
  '#0284c7', // Sky
  '#2563eb', // Blue
  '#4f46e5', // Indigo
  '#7c3aed', // Violet
  '#9333ea', // Purple
  '#c026d3', // Fuchsia
  '#db2777', // Pink
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


const shapeOptions = [
  {
    value: 'rounded-rectangle',
    label: 'Rounded Rectangle',
  },
  {
    value: 'square',
    label: 'Square',
  },
  {
    value: 'circle',
    label: 'Circle',
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
const sidebarOpen = computed(() => {
  return selectedNodes.value.length > 0

})
/*
   

*/
</script>

<template>
    <div class=" h-screen overflow-hidden "></div>
    <Navbar
        @export-json="exportToJson"
        @export-game-data="exportGameData"
        @import-json="importFromJson"
        @import-tsv="importTSVData"
      />
    <SidebarProvider v-model:open="sidebarOpen">
    <main class="fixed inset-0 flex flex-col overflow-hidden font-sans w-full">
        <Sidebar side="left" variant="inset"  class="top-12 h-[calc(100vh-3rem)]">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <NodePropertySidebar
                      :is-open="sidebarOpen"
                      :nodes="selectedNodes"
                      :selected-nodes="selectedNodes"
                      :icon-options="iconOptions"
                      :preset-colors="presetColors"
                      :icon-url-map="iconUrlMap"
                      :shape-options="shapeOptions"
                      @close="() => {}"
                      
                    />
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
        </Sidebar>
      
      
      <div class="absolute inset-0">
        
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
          
          class=" w-full h-full"

          :pan-on-drag="[1]"

          :selection-mode="SelectionMode.Partial"
          :selection-on-drag="true"
          :selection-key-code="true"
          :edges-focusable="true"
          
          

          :elements-selectable="true"
          :nodes-focusable="false"



          :zoom-on-double-click="false"
          :select-nodes-on-drag="false"
          :elevate-nodes-on-select="false"


          :snap-to-grid="true"
          :snap-grid="SNAP_GRID"
          :multi-selection-key-code="'shift'"
          
        
          
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
          :gap="BACKGROUND_GAP"
          :size="3"
          :offset="[1.5,1.5]"
          class="dark"
          
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
      <div
        class="
          absolute
          right-4
          bottom-4
          z-50
          rounded-lg
          border
          px-2
          py-1
          text-sm
          shadow-md
        "
      >

        <div class="text-[10px]">
          v0.2.0 alpha
        </div>
      </div>
      
    </main>
    <Toaster class="w-full"/>
    </SidebarProvider>
  
  
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
  /*background-color: rgba(59, 130, 246, 0.12) !important;*/
  border: 1.5px dashed #60a5fa !important;
  border-radius: 6px !important;
}
:deep(.vue-flow__nodesselection-rect),
:deep(.vue-flow__nodesselection) {
  display: none !important;
  pointer-events: none !important;
}
</style>