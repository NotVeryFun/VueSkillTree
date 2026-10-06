
<script setup lang="ts">
import type { SkillNodeShape } from './SkillNode.vue'
import { ref } from 'vue'
import type { SkillGraphNode } from '../type/SkillNode.ts'
import PropertySidebarTitle from './PropertySidebar/PropertySidebarTitle.vue'
import PropertySidebarTabs from './PropertySidebar/PropertySidebarTabs.vue'
import PropertySidebarNodeId from './PropertySidebar/PropertySidebarNodeId.vue'
import PropertySidebarLabel from './PropertySidebar/PropertySidebarLabel.vue'
import PropertySidebarDescription from './PropertySidebar/PropertySidebarDescription.vue'
import PropertySidebarCostPerLevel from './PropertySidebar/PropertySidebarCostPerLevel.vue'
import PropertySidebarMaxLevel from './PropertySidebar/PropertySidebarMaxLevel.vue'
import PropertySidebarKVs from './PropertySidebar/PropertySidebarKVs.vue'
import PropertySidebarStyleIcon from './PropertySidebar/PropertySidebarStyleIcon.vue'
import PropertySidebarStyleShape from './PropertySidebar/PropertySidebarStyleShape.vue'
import PropertySidebarStyleBackgroundColor from './PropertySidebar/PropertySidebarStyleBackgroundColor.vue'
import SidebarMenuItem from './ui/sidebar/SidebarMenuItem.vue'

interface SidebarProps {
  isOpen: boolean
  nodes: SkillGraphNode[]
  iconOptions: string[]
  iconUrlMap?: Record<string, string>
  presetColors: string[]

  shapeOptions: {
    value: SkillNodeShape
    label: string
  }[]
}

const props = defineProps<SidebarProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const activeTab = ref<'properties' | 'style'>('properties')


</script>

<template>
  <SidebarMenuItem>
    <!-- 標題 -->

    <PropertySidebarTitle
      :nodes="nodes"
    ></PropertySidebarTitle>
    

    <PropertySidebarTabs
      :active-tab="activeTab"
      @switch-tab-properties="activeTab = 'properties'"
      @switch-tab-style="activeTab = 'style'"
    >
    </PropertySidebarTabs>
    <!-- 沒有選取 Node -->
    <div
      v-if="nodes.length === 0"
      class="flex-1 flex items-center justify-center
             text-slate-500 text-sm h-full"
    >
      No Skill Selected
    </div>

    <!-- 有選取 Node -->
     
    <div
      v-else
      class="flex overflow-y-auto"
    >

      <div v-if="activeTab === 'properties'" class="flex flex-col gap-2 w-full p-1">
          <!-- ========================= -->
        <!-- Node ID -->
        <!-- ========================= -->

        <PropertySidebarNodeId
          :nodes="nodes"
        >

        </PropertySidebarNodeId>

        <!-- ========================= -->
        <!-- Label(名稱) -->
        <!-- ========================= -->
        <PropertySidebarLabel
          :nodes="nodes"
        >

        </PropertySidebarLabel>

        <!-- ========================= -->
        <!-- 天賦描述 -->
        <!-- ========================= -->
        <PropertySidebarDescription
          :nodes="nodes"
        >

        </PropertySidebarDescription>


        <!-- ========================= -->
        <!-- Cost Per Level -->
        <!-- ========================= -->

        <PropertySidebarCostPerLevel
        :nodes="nodes"
        >

        </PropertySidebarCostPerLevel>


        <!-- ========================= -->
        <!-- Max Level -->
        <!-- ========================= -->

        <PropertySidebarMaxLevel
          :nodes="nodes"
        >

        </PropertySidebarMaxLevel>


        <PropertySidebarKVs
          :nodes="nodes"
        >

        </PropertySidebarKVs>
      </div>


    <!-- 樣式 -->
    <div v-else class="flex flex-col gap-2 p-1">
      <!-- Icon -->
      <!-- Shape -->
      <!-- Color -->
       <!-- ========================= -->
      <!-- Icon -->
      <!-- ========================= -->

      <PropertySidebarStyleIcon
        :nodes="nodes"
        :icon-options="iconOptions"
        :icon-url-map="iconUrlMap"
      >

      </PropertySidebarStyleIcon>
      <!-- Shape 選擇區 -->
      <PropertySidebarStyleShape
      
        :nodes="nodes"
        :shape-options="shapeOptions"
      >

      </PropertySidebarStyleShape>
      <!-- ========================= -->
      <!-- Background Color -->
      <!-- ========================= -->

      <PropertySidebarStyleBackgroundColor
      
        :nodes="nodes"
        :preset-colors="presetColors"
      >
      </PropertySidebarStyleBackgroundColor>
    </div>
    </div>
  </SidebarMenuItem>
</template>
