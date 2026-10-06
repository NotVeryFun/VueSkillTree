


<script setup lang="ts">
    import type { SkillGraphNode, SkillNodeData } from '@/type/SkillNode';
    import { usePropertySidebarUtils } from './PropertySidebarUtils';


    const { getCommonValue } = usePropertySidebarUtils()

    const props = defineProps<{
      nodes: SkillGraphNode[] , 
      iconUrlMap?: Record<string, string>,
      iconOptions: string[]
    
    
    }>()
    const updateProperty = (
      property: keyof SkillNodeData,
      value: string
    ) => {

      for(const n of props.nodes){
        (n.data[property] as string) = value
      }
    }
    const iconValue = () => {
  return getCommonValue(props.nodes ,'icon')
}
const getIconUrl = (iconName: string) => {
  if (props.iconUrlMap?.[iconName]) {
    return props.iconUrlMap[iconName]
  }
  console.log(iconName)
  //iconName由 前面的資料夾和後面的檔案名稱所構成，如_1_Game/axe.svg
  return `/SkillIcon/${iconName}`
}


</script>
<template>
    <div>
        <label
          class="text-xs font-semibold text-muted-foreground
                 uppercase tracking-wider block mb-1"
        >
          Icon
        </label>
        <!-- Icon 選擇 -->
        <div
          class="grid grid-cols-5 gap-2 max-h-80
                 overflow-y-auto p-1 
                 rounded border 
                 
                 "
        >
          <button
            v-for="iconName in iconOptions"
            :key="iconName"
            class="p-0.5  hover:bg-emerald-600
                   rounded transition flex items-center
                   justify-center border 
                   aspect-square "
            :class="{
              'bg-emerald-600! border-emerald-400!':
                iconValue() === iconName
            }"
            :title="iconName"
            @click="updateProperty('icon', iconName)"
          >
            <img
              :src="getIconUrl(iconName)"
              :alt="iconName"
              class="w-6 h-6 object-contain pointer-events-none brightness-0 invert"
            />
          </button>
        </div>
      </div>
</template>