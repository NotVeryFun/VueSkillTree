
<script setup lang="ts">
    import type { GraphEdge } from '@vue-flow/core';
    

    import { type SkillGraphNode } from '../../type/SkillNode.ts'
    import { ref } from 'vue';
    import { Import } from 'lucide-vue-next';
    import Button from '../ui/button/Button.vue';

    const emits = defineEmits<{
        (e: 'import-data', data: { nodes: SkillGraphNode[]; edges: GraphEdge[] }): void
    }>()



    const InputRef = ref<HTMLInputElement | null>(null)

    // ============================================================
    // 匯入
    // ============================================================

    const triggerFileInput = () => {
        InputRef.value?.click()
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

                emits('import-data', parsedData)

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

    <Button
        class="
          h-full
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
        title="Load editor state from saved editor data"
        @click="triggerFileInput"
      >
        <Import :size="15" />
        <span>Import Editor Data</span>
      </Button>
      <!-- Hidden File Input -->

      <input
        ref="InputRef"
        type="file"
        accept=inputFileType
        class="hidden"
        @change="handleFileChange"
      />

</template>