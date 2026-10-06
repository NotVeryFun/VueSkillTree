


<script setup lang="ts">

    const props = defineProps<{activeTab : 'properties' | 'style'}>()

    const emits = defineEmits<{
      'switch-tab-properties' : [],
      'switch-tab-style' : []
    }>()
</script>
<template>
    <div class="flex border-b border-slate-700 mb-5">
      <button
        type="button"
        class="flex-1 py-2 text-sm font-semibold transition"
        :class="
          activeTab === 'properties'
            ? 'text-emerald-400 border-b-2 border-emerald-400'
            : 'text-slate-400 hover:text-slate-200'
        "
        @click="emits('switch-tab-properties')"
      >
        Property
      </button>

      <button
        type="button"
        class="flex-1 py-2 text-sm font-semibold transition"
        :class="
          activeTab === 'style'
            ? 'text-emerald-400 border-b-2 border-emerald-400'
            : 'text-slate-400 hover:text-slate-200'
        "
        @click="emits('switch-tab-style')"
      >
        Style
      </button>
    </div>
</template>