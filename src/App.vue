<script setup lang="ts">
import { ref, markRaw , onMounted, onUnmounted } from 'vue'
import {
  MarkerType,
  SelectionMode,
  VueFlow
} from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import './style.css'

import SkillNode from './components/SkillNode.vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import FloatingEdge from './components/FloatingEdge.vue'

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


const nodes = ref(initialNodes)
const edges = ref(initialEdges)

const nodeTypes = {
  custom: markRaw(SkillNode),
}

const edgeTypes = {
  floating: markRaw(FloatingEdge),
}

const {
  start: startSkillConnection,
} = useSkillConnection()

const {
  addNodeFromHandle,
  deleteNode,
  deleteEdge
} = useSkillTreeActions()

const {
  exportToJson,
  importFromJson,
} = useSkillTreeIO()

const {
  isOpen: isSidebarOpen,
  selectedNode,
  close: closeSidebar,
  toggle: toggleSidebar,
} = useSkillTreeSidebar()

const {
  iconOptions,
  iconUrlMap,
} = useSkillIcons()


const {
  selectedNodes,
  selectedEdges,
  clearSelection,
  handleKeyDown
} = useSkillTreeSelection()

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
        handleKeyDown
    )
})

onUnmounted(() => {
    window.removeEventListener(
        'keydown',
        handleKeyDown
    )
})
</script>

<template>
  <div class="fixed inset-0 flex flex-col overflow-hidden bg-slate-900 font-sans">

    <Navbar
      @toggle-sidebar="toggleSidebar"
      @export-json="exportToJson"
      @import-json="importFromJson"
    />

    <Sidebar
      :is-open="isSidebarOpen"
      :node="selectedNode"
      :icon-options="iconOptions"
      :preset-colors="presetColors"
      :icon-url-map="iconUrlMap"
      @close="closeSidebar"
    />

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

      :nodes-selection-active="false"
      
    >
      <template #node-custom="nodeProps">
        <SkillNode
          v-bind="nodeProps"
          @add-node-from-handle="addNodeFromHandle"
          @start-skill-connection="startSkillConnection"
        />
      </template>
    </VueFlow>

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