<script setup lang="ts">
interface SidebarProps {
  isOpen: boolean
  node: any
  iconOptions: string[]
  iconUrlMap?: Record<string, string>
  presetColors: string[]
}
const props =  defineProps<SidebarProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const getIconUrl = (iconName: string) => {
  if (props.iconUrlMap && props.iconUrlMap[iconName]) {
    return props.iconUrlMap[iconName]
  }
  return `/SkillIcon/_1_Game/${iconName}`
}
</script>

<template>
  <div
    class="absolute top-14 left-0 h-[calc(100%-3.5rem)] w-80 bg-slate-800 border-r border-slate-700 shadow-2xl z-20 transition-transform duration-300 ease-in-out p-5 flex flex-col text-slate-100"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- 標題與關閉按鈕 -->
    <div class="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
      <h2 class="text-lg font-bold flex items-center gap-2">
        <span>⚙️</span> 編輯天賦屬性
      </h2>
      <button
        @click="emit('close')"
        class="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700 transition"
      >
        ✕
      </button>
    </div>

    <!-- 當有選中的 Node 時呈現內容 -->
    <div v-if="node" class="space-y-6 flex-1 overflow-y-auto">
      
      <!-- Node ID 顯示 -->
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Node ID</label>
        <div class="px-3 py-2 bg-slate-900 rounded border border-slate-700 text-sm font-mono text-emerald-400">
          {{ node.id }}
        </div>
      </div>

      <!-- 編輯 Label -->
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">天賦名稱 (Label)</label>
        <input
          v-model="node.data.label"
          type="text"
          class="w-full px-3 py-2 bg-slate-900 rounded border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
        />
      </div>

      <!-- Icon 選擇區 -->
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Icon SVG 檔名</label>
        <input
          v-model="node.data.icon"
          type="text"
          placeholder="例如: sword.svg"
          class="w-full px-3 py-2 bg-slate-900 rounded border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm mb-3"
        />
        
        <!-- 自動渲染所有抓到的 SVG 按鈕 -->
        <div class="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-900/50 rounded border border-slate-700">
          <button
            v-for="iconName in iconOptions"
            :key="iconName"
            @click="node.data.icon = iconName"
            class="p-2 bg-slate-700 hover:bg-emerald-600 rounded transition flex items-center justify-center border border-slate-600 aspect-square"
            :class="{ '!bg-emerald-600 !border-emerald-400': node.data.icon === iconName }"
            :title="iconName"
          >
            <img
              :src="getIconUrl(iconName)"
              :alt="iconName"
              class="w-6 h-6 object-contain pointer-events-none"
            />
          </button>
        </div>
      </div>

      <!-- 節點顏色設定 -->
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">節點顏色</label>
        
        <div class="flex items-center gap-2 mb-3">
          <!-- 原生顏色選擇器 -->
          <input
            v-model="node.data.backgroundColor"
            type="color"
            class="w-10 h-9 p-1 bg-slate-900 rounded border border-slate-700 cursor-pointer"
          />
          <!-- 顯示 Hex 色碼 -->
          <input
            v-model="node.data.backgroundColor"
            type="text"
            placeholder="#1e293b"
            class="flex-1 px-3 py-1.5 bg-slate-900 rounded border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <!-- 快速預設顏色按鈕 -->
        <div class="flex gap-2">
          <button
            v-for="color in presetColors"
            :key="color"
            @click="node.data.backgroundColor = color"
            class="w-7 h-7 rounded-full border border-slate-600 transition-transform hover:scale-110 active:scale-95"
            :style="{ backgroundColor: color }"
          />
        </div>
      </div>

    </div>
  </div>
</template>