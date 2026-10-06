


<script setup lang="ts">
    import type { SkillGraphNode, SkillNodeData } from '@/type/SkillNode';
    import { usePropertySidebarUtils } from './PropertySidebarUtils';


    const { getCommonValue } = usePropertySidebarUtils()

    const props = defineProps<{
      nodes: SkillGraphNode[] , 
      presetColors: string[]
    }>()
    const updateProperty = (
      property: keyof SkillNodeData,
      value: string
    ) => {

      for(const n of props.nodes){
        (n.data[property] as string) = value
      }
    }

    const backgroundColorValue = () => {
      return getCommonValue(props.nodes , 'backgroundColor')
    }

</script>
<template>
    <div>
        <label
          class="text-xs font-semibold text-muted-foreground
                 uppercase tracking-wider block mb-1"
        >
          Color
        </label>

        <div class="flex items-center gap-2 mb-3">

          <!--
            HTML color input 不支援空值。
            因此只有所有 Node 顏色相同時才顯示 color picker。
          -->
          <input
            v-if="backgroundColorValue() !== ''"
            :value="backgroundColorValue()"
            type="color"
            class="w-10 h-9 p-1 bg-slate-900 rounded
                   border border-slate-700 cursor-pointer"
            @input="
              updateProperty(
                'backgroundColor',
                ($event.target as HTMLInputElement).value
              )
            "
          />

          <!-- Hex -->
          <input
            :value="backgroundColorValue()"
            type="text"
            placeholder="#1e293b"
            class="flex-1 px-3 py-1.5 

                   rounded border 
                   text-slate-100 font-mono text-xs
                   focus:outline-none focus:border-emerald-500"
            @input="
              updateProperty(
                'backgroundColor',
                ($event.target as HTMLInputElement).value
              )
            "
          />
        </div>

        <!-- 快速預設顏色 -->
        <div class="flex gap-2 flex-wrap p-1 justify-center">
          <button
            v-for="color in presetColors"
            :key="color"
            class="w-6 h-6 rounded-full
                   border 
                   transition-transform
                   hover:scale-110 active:scale-95"
            :style="{ backgroundColor: color }"
            @click="updateProperty('backgroundColor', color)"
          />
        </div>
      </div>
</template>