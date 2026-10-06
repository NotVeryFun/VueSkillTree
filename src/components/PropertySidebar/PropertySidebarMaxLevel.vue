


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
      if(typeof(value) == 'string'){
        return
      }
      updatePropertyNumber('maxLevel' , value)
       
    }


</script>
<template>
    <div>
      <label
        class="text-xs font-semibold text-muted-foreground
              uppercase tracking-wider block mb-1"
      >
        Max Level
      </label>

      <Input
        :model-value="getCommonNumberValue(nodes , 'maxLevel')"
        type="number"
        min="1"
        step="1"
        :placeholder="
          nodes.length > 1 && getCommonNumberValue(nodes , 'maxLevel') === ''
            ? 'Skills have different Max Level'
            : 'Example'
        "
        class="h-6"
        @update:model-value="
          (v) => update(
            v
          )
        "
      />
    </div>
</template>