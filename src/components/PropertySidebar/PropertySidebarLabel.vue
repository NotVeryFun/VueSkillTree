


<script setup lang="ts">
    import type { SkillGraphNode, SkillNodeData } from '@/type/SkillNode';
    import { usePropertySidebarUtils } from './PropertySidebarUtils';
import Input from '../ui/input/Input.vue';


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


    const labelValue = () => {
  return getCommonValue(props.nodes ,'label')
}

</script>
<template>
    <div>
        <label
          class="text-xs font-semibold text-muted-foreground
                 uppercase tracking-wider block mb-1"
        >
          Name
        </label>

        <Input
          :model-value="labelValue()"
          type="text"
          :placeholder="
            nodes.length > 1 && labelValue() === ''
              ? 'Skills have different name'
              : ''
          "
          class=""
          @update:model-value="
            (v) => updateProperty(
              'label',
              typeof(v) == 'string' ? v : ''
            )
          "
        />
      </div>
</template>