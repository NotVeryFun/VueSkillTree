<script setup lang="ts">
interface SkillNodeTooltipProps {
  visible: boolean
  x: number
  y: number

  label?: string
  description?: string

  costPerLevel?: number
  maxLevel?: number
  currentLevel?: number
}

defineProps<SkillNodeTooltipProps>()
</script>

<template>
  <div
    v-if="visible"
    class="
      fixed
      z-[100]
      pointer-events-none

      min-w-[220px]
      max-w-[320px]

      px-4
      py-3

      bg-slate-950/95
      border
      border-slate-600
      rounded-lg
      shadow-xl

      text-slate-100
    "
    :style="{
      left: `${x}px`,
      top: `${y}px`,
    }"
  >

    <!-- 技能名稱 -->
    <div
      class="
        text-base
        font-bold
        text-white
        mb-2
      "
    >
      {{ label || '未命名技能' }}
    </div>

    <!-- Description -->
    <div
      class="
        text-xs
        leading-relaxed
        text-slate-300
        mb-3
        whitespace-pre-line
      "
    >
      {{ description || '尚無技能描述' }}
    </div>

    <!-- 分隔線 -->
    <div class="border-t border-slate-700 mb-2" />

    <!-- 技能資訊 -->
    <div
      class="
        flex
        items-center
        justify-between
        gap-4
        text-xs
      "
    >

      <!-- 技能點 -->
      <div class="flex items-center gap-1">
        <span class="text-slate-400">
          技能點
        </span>

        <span class="font-bold text-amber-400">
          {{ costPerLevel ?? 0 }}
        </span>
      </div>

      <!-- Level -->
      <div class="flex items-center gap-1">
        <span class="text-slate-400">
          Level
        </span>

        <span class="font-bold text-emerald-400">
          {{ currentLevel ?? 0 }}/{{ maxLevel ?? 1 }}
        </span>
      </div>

    </div>

  </div>
</template>