<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'export-json'): void
  (e: 'import-json', data: { nodes: any[]; edges: any[] }): void
}>()

// 隱藏的 file input 引用
const fileInputRef = ref<HTMLInputElement | null>(null)

// 觸發檔案選擇器
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 處理 JSON 檔案讀取
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const parsedData = JSON.parse(e.target?.result as string)
      if (Array.isArray(parsedData.nodes) && Array.isArray(parsedData.edges)) {
        emit('import-json', parsedData)
      } else {
        alert('無效的 JSON 格式！請確保 JSON 包含 nodes 與 edges 陣列。')
      }
    } catch (err) {
      alert('解析 JSON 檔案失敗，請檢查檔案格式。')
    }
  }
  reader.readAsText(file)

  // 清空 input，確保重複選擇相同檔案時仍能觸發 change
  target.value = ''
}
</script>

<template>
  <header class="absolute top-0 left-0 w-full h-14 bg-slate-800/90 backdrop-blur-md border-b border-slate-700/80 z-10 px-4 flex items-center justify-between text-slate-100 shadow-md">
    <!-- 標題與 Sidebar 切換按鈕 -->
    <div class="flex items-center gap-3">
      <button
        @click="emit('toggle-sidebar')"
        class="p-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 rounded-lg border border-slate-600 transition flex items-center justify-center"
        title="切換側邊欄"
      >
        <span>☰</span>
      </button>

      <div class="flex items-center gap-2 font-bold text-sm md:text-base tracking-wide text-emerald-400">
        <span>🌳</span> 天賦樹編輯器
      </div>
    </div>

    <!-- 右側操作按鈕區 (匯出與匯入) -->
    <div class="flex items-center gap-2">
      <!-- 導出 JSON -->
      <button
        @click="emit('export-json')"
        class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs md:text-sm font-semibold rounded-lg shadow transition flex items-center gap-1.5"
      >
        <span>📥</span> 導出 JSON
      </button>

      <!-- 匯入 JSON -->
      <button
        @click="triggerFileInput"
        class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs md:text-sm font-semibold rounded-lg shadow transition flex items-center gap-1.5"
      >
        <span>📤</span> 匯入 JSON
      </button>

      <!-- 隱藏的 File Input 供檔案上傳 -->
      <input
        ref="fileInputRef"
        type="file"
        accept=".json"
        class="hidden"
        @change="handleFileChange"
      />
    </div>
  </header>
</template>