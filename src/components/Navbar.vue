<script setup lang="ts">
import { ref } from 'vue'
import {
  PanelLeft,
  Network,
  Save,
  Gamepad2,
  Upload,
} from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'export-json'): void
  (e: 'export-game-data'): void
  (e: 'import-json', data: { nodes: any[]; edges: any[] }): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

// ============================================================
// 匯入
// ============================================================

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const reader = new FileReader()

  reader.onload = (e) => {

    try {

      const parsedData = JSON.parse(
        e.target?.result as string
      )

      if (
        Array.isArray(parsedData.nodes) &&
        Array.isArray(parsedData.edges)
      ) {

        emit('import-json', parsedData)

      } else {

        alert(
          '無效的編輯器 JSON 格式！\n\n' +
          '請確保 JSON 包含 nodes 與 edges 陣列。'
        )

      }

    } catch {

      alert(
        '解析 JSON 檔案失敗，請檢查檔案格式。'
      )

    }

  }

  reader.readAsText(file)

  // 確保下次選同一個檔案仍會觸發 change
  target.value = ''
}
</script>

<template>

  <header
    class="
      absolute top-0 left-0 right-0
      z-50
      bg-slate-900/90
      backdrop-blur-md
      border-b border-slate-700/80
      px-4
      flex items-center justify-between
      text-slate-100
      shadow-lg
    "
    style="height: 56px; min-height: 56px;"
  >

    <!-- ====================================================== -->
    <!-- 左側 -->
    <!-- ====================================================== -->

    <div class="flex items-center gap-3">

      <!-- Sidebar -->
      <button
        @click="emit('toggle-sidebar')"
        class="
          w-9
          h-9

          flex
          items-center
          justify-center

          rounded-lg

          text-slate-300

          hover:text-white
          hover:bg-slate-700

          border
          border-transparent
          hover:border-slate-600

          transition
        "
        title="切換側邊欄"
      >
        <PanelLeft :size="18" />
      </button>


      <div class="h-5 w-px bg-slate-700" />


      <!-- Logo / Title -->
      <div class="flex items-center gap-2.5">

        <Network
          :size="19"
          class="text-emerald-400"
        />

        <span
          class="
            font-semibold
            text-sm
            tracking-wide
            text-slate-100
          "
        >
          天賦樹編輯器
        </span>

      </div>

    </div>


    <!-- ====================================================== -->
    <!-- 右側 -->
    <!-- ====================================================== -->

    <div class="flex items-center gap-2">

      <!-- ================================================== -->
      <!-- 儲存編輯器 -->
      <!-- ================================================== -->

      <button
        @click="emit('export-json')"
        class="
          h-9
          px-3

          flex
          items-center
          gap-2

          rounded-lg

          bg-slate-800
          hover:bg-slate-700

          border
          border-slate-700
          hover:border-slate-600

          text-slate-200

          text-xs
          font-medium

          transition
        "
        title="儲存完整的 Vue Flow 編輯器資料"
      >
        <Save :size="15" />

        <span>
          儲存編輯器
        </span>
      </button>


      <!-- ================================================== -->
      <!-- 匯出遊戲資料 -->
      <!-- ================================================== -->

      <button
        @click="emit('export-game-data')"
        class="
          h-9
          px-3

          flex
          items-center
          gap-2

          rounded-lg

          bg-emerald-600
          hover:bg-emerald-500

          text-white

          text-xs
          font-semibold

          transition

          shadow-sm
        "
        title="匯出給遊戲引擎使用的 Skill Tree JSON"
      >
        <Gamepad2 :size="15" />

        <span>
          匯出遊戲資料
        </span>
      </button>


      <!-- ================================================== -->
      <!-- 分隔線 -->
      <!-- ================================================== -->

      <div class="h-5 w-px bg-slate-700 mx-1" />


      <!-- ================================================== -->
      <!-- 匯入編輯器 -->
      <!-- ================================================== -->

      <button
        @click="triggerFileInput"
        class="
          h-9
          px-3

          flex
          items-center
          gap-2

          rounded-lg

          bg-blue-600
          hover:bg-blue-500

          text-white

          text-xs
          font-semibold

          transition

          shadow-sm
        "
        title="載入之前儲存的編輯器 JSON"
      >
        <Upload :size="15" />

        <span>
          匯入編輯器
        </span>
      </button>


      <!-- Hidden File Input -->

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