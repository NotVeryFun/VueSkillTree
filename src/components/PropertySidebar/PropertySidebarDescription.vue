


<script setup lang="ts">
    import type { SkillGraphNode, SkillNodeData } from '@/type/SkillNode';
    import { usePropertySidebarUtils } from './PropertySidebarUtils';
import Textarea from '../ui/textarea/Textarea.vue';


    const { getCommonValue } = usePropertySidebarUtils()

    const props = defineProps<{nodes: SkillGraphNode[]}>()

    const updateProperty = (
      property: keyof SkillNodeData,
      value: string
    ) => {

      for(const n of props.nodes){
        (n.data[property] as string) = value
      }
    }


</script>
<template>
    <div>
      <label
        class="text-xs font-semibold text-muted-foreground
              uppercase tracking-wider block mb-1"
      >
        Description
      </label>

      <Textarea
        :model-value="getCommonValue(nodes , 'description')"
        
        rows="4"
        :placeholder="
          nodes.length > 1 && getCommonValue(nodes , 'description') === ''
            ? 'Skills have different description'
            : 'Skill Description...'
        "
        class="w-full px-3 py-2  rounded
              border
              focus:outline-none focus:border-emerald-500
              text-sm resize-none"
        @update:model-value="(v) =>
          updateProperty('description' , 
          typeof(v) == 'string' ? v : '')
        "
      />
    </div>
</template>