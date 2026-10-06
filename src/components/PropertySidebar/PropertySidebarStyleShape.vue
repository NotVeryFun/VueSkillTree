


<script setup lang="ts">
    import type { SkillGraphNode, SkillNodeData } from '@/type/SkillNode';
    import { usePropertySidebarUtils } from './PropertySidebarUtils';
import type { SkillNodeShape } from '../SkillNode.vue';


    const { getCommonNodeShape } = usePropertySidebarUtils()

    const props = defineProps<{
      nodes: SkillGraphNode[] , 
      shapeOptions: {
      value: SkillNodeShape
      label: string
    }[]
    
    
    }>()
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
        class="text-xs font-semibold 
        uppercase tracking-wider block mb-1 
        text-muted-foreground"
      >
        Shape
      </label>

      <div
        class="
          grid
          grid-cols-3
          gap-2
          p-1
          rounded
          border
        "
      >
        <button
          v-for="shape in shapeOptions"
          :key="shape.value"
          type="button"
          class="
            h-20
            hover:bg-emerald-600
            rounded
            transition
            flex
            flex-col
            items-center
            justify-center
            gap-1
            border
          "
          :class="{
            'bg-emerald-600! border-emerald-400!':
              getCommonNodeShape(nodes) === shape.value
          }"
          @click="updateProperty('shape', shape.value)"
        >

          <!-- Shape Preview -->
          <div
            class="w-10 h-10 bg-foreground"
            :class="{
              'rounded-xl':
                shape.value === 'rounded-rectangle',

              'rounded-none':
                shape.value === 'square',

              'rounded-full':
                shape.value === 'circle',
            }"
          />

          <span class="text-xs text-slate-200">
            
          </span>

        </button>
      </div>
    </div>
</template>