


<script setup lang="ts">
    import type { SkillGraphNode, SkillNodeData } from '@/type/SkillNode';
    import { usePropertySidebarUtils } from './PropertySidebarUtils';
import Input from '../ui/input/Input.vue';


    const { getCommonNumberValue} = usePropertySidebarUtils()

    const props = defineProps<{nodes: SkillGraphNode[]}>()

    const updatePropertyNumber = (
      property: keyof SkillNodeData,
      value: number
    ) => {

      for(const n of props.nodes){
        (n.data[property] as number) = value
      }
    }

    function update(value : string | number){
      
      if(typeof(value) == 'string'){return;}
      updatePropertyNumber('costPerLevel' , value)
    }


</script>
<template>
    <div>
      <label
        class="text-xs font-semibold text-muted-foreground
              uppercase tracking-wider block mb-1"
      >
        Cost per skill level
      </label>

      <Input
        :model-value="getCommonNumberValue(nodes , 'costPerLevel')"
        type="number"
        min="0"
        step="1"
        :placeholder="
          nodes.length > 1 && getCommonNumberValue(nodes , 'costPerLevel') === ''
            ? 'Skills have different cost'
            : 'Example：1'
        "
        class="h-6"
        @update:model-value="
          update
        "
      />
    </div>
</template>