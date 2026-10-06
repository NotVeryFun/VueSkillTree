


<script setup lang="ts">
import type { SkillGraphNode } from '@/type/SkillNode';

    const props = defineProps<{nodes: SkillGraphNode[]}>()

    const isSingleNodeSelected = () => {
        return props.nodes.length === 1
    }


</script>
<template>
    <div
      class="flex items-center justify-between
             pb-2 border-b border-slate-700"
    >
      <h2 class="text-lg font-bold flex items-center gap-2">

        <span v-if="isSingleNodeSelected()">
          Edit Skill
        </span>

        <span v-else>
          Edit {{ nodes.length }} Skills
        </span>
      </h2>

    </div>
</template>