```vue
<script setup lang="ts">
import type { SkillNodeShape } from './SkillNode.vue'
import { computed, ref } from 'vue'
import type { SkillGraphNode, SkillNodeData } from '../type/SkillNode.ts'
import { useVueFlow } from '@vue-flow/core'


const {
  getNodes,
} = useVueFlow()

interface SidebarProps {
  isOpen: boolean
  nodes: SkillGraphNode[]
  iconOptions: string[]
  iconUrlMap?: Record<string, string>
  presetColors: string[]

  shapeOptions: {
    value: SkillNodeShape
    label: string
  }[]
}

const props = defineProps<SidebarProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const getIconUrl = (iconName: string) => {
  if (props.iconUrlMap?.[iconName]) {
    return props.iconUrlMap[iconName]
  }
  console.log(iconName)
  //iconName由 前面的資料夾和後面的檔案名稱所構成，如_1_Game/axe.svg
  return `/SkillIcon/${iconName}`
}

/**
 * 目前是否為單一 Node
 */
const isSingleNodeSelected = () => {
  return props.nodes.length === 1
}


const isNoNodeSelected = () => {
  return props.nodes.length === 0
}

/**
 * 取得目前 Node 的共同屬性值
 *
 * 所有 Node 都相同：
 *     → 回傳該值
 *
 * 有任何不同：
 *     → 回傳 ''
 *
 * 沒有 Node：
 *     → 回傳 ''
 */
const getCommonValue = (
  property: keyof SkillNodeData
): string => {
  //console.log(props.nodes.length)
  if (props.nodes.length === 0) {
    return ''
  }

  const firstValue = props.nodes[0].data[property]

  const allSame = props.nodes.every(
    node => node.data[property] === firstValue
  )

  if (!allSame) {
    return ''
  }

  return typeof firstValue === 'string'
    ? firstValue
    : ''
}


const getCommonNumberValue = (
  property: keyof SkillNodeData
): number | '' => {
  if (props.nodes.length === 0) {
    return ''
  }

  const values = props.nodes.map(
    node => node.data[property]
  )
  // 所有 Node 都沒有值
  if (values.every(value => value === undefined || value === null)) {
    return 1
  }

  // 多個 Node，但值不同
  const first = values[0]


  if (values.some(value => value !== first)) {
    return ''
  }

  return typeof first === 'number'
    ? first
    : ''
}

/**
 * 當 Sidebar 修改屬性
 *
 * 不管現在是單選還是多選，
 * 都交給父層處理。
 */
const updateProperty = (
  property: keyof SkillNodeData,
  value: string
) => {

  for(const n of props.nodes){
    (n.data[property] as string) = value
  }
}

const updatePropertyNumber = (
  property: keyof SkillNodeData,
  value: number
) => {

  for(const n of props.nodes){
    (n.data[property] as number) = value
  }
}

const updateNodeId = (newId: string) => {
  const trimmedId = newId.trim()

  if (!trimmedId) {
    return
  }

  const selectedIds =  new Set();


  for(const node of props.nodes){
    selectedIds.add(node.data.skill_id)
  }

  const duplicated = getNodes.value.some(
    node =>
      node.data.skill_id === trimmedId &&
      !selectedIds.has(node.id)
  )

  if (duplicated) {
    alert(`Node ID ${trimmedId} already existed , please choose another id.`)
    return
  }


  //真正可以改ID，理論上來說只能改一個node
  const selectedNode = props.nodes[0]
   
  selectedNode.data.skill_id = trimmedId


 

  

}

const labelValue = () => {
  return getCommonValue('label')
}

const iconValue = () => {
  return getCommonValue('icon')
}

const backgroundColorValue = () => {
  return getCommonValue('backgroundColor')
}

const currentShape = computed(() => {

  if (props.nodes.length === 0) {
    return ''
  }
  
  const firstShape =
    props.nodes[0].data.shape ?? 'rounded-rectangle'

  const allSame =
    props.nodes.every(
      node =>
        (node.data.shape ?? 'rounded-rectangle')
        === firstShape
    )

  return allSame ? firstShape : ''
})

const activeTab = ref<'properties' | 'style'>('properties')

function addCustomProperty(node : SkillGraphNode){
  if(node.data.kvs == undefined){
      node.data.kvs = []
  }
  node.data.kvs.push({key : "" , value : ""})

}

function removeCustomProperty(node : SkillGraphNode ,idx : number){
  node.data.kvs.splice(idx , 1);

}
</script>

<template>
  <div
    class="absolute top-14 left-0 h-[calc(100%-3.5rem)] w-80
           bg-slate-800 border-r border-slate-700 shadow-2xl
           z-20 transition-transform duration-0 ease-in-out
           p-5 flex flex-col text-slate-100"
    :class="!isNoNodeSelected() ? 'translate-x-0' : '-translate-x-full'"
  >

    <!-- 標題 -->
    <div
      class="flex items-center justify-between
             pb-4 border-b border-slate-700 mb-6"
    >
      <h2 class="text-lg font-bold flex items-center gap-2">
        <span>⚙️</span>

        <span v-if="isSingleNodeSelected()">
          Edit Skill
        </span>

        <span v-else>
          Edit {{ nodes.length }} Skills
        </span>
      </h2>

      <button
        class="text-slate-400 hover:text-white p-1
               rounded-md hover:bg-slate-700 transition"
        @click="emit('close')"
      >
        ✕
      </button>
    </div>
    <div class="flex border-b border-slate-700 mb-5">
      <button
        type="button"
        class="flex-1 py-2 text-sm font-semibold transition"
        :class="
          activeTab === 'properties'
            ? 'text-emerald-400 border-b-2 border-emerald-400'
            : 'text-slate-400 hover:text-slate-200'
        "
        @click="activeTab = 'properties'"
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
        @click="activeTab = 'style'"
      >
        Style
      </button>
    </div>

    
    <!-- 沒有選取 Node -->
    <div
      v-if="nodes.length === 0"
      class="flex-1 flex items-center justify-center
             text-slate-500 text-sm"
    >
      No Skill Selected
    </div>

    <!-- 有選取 Node -->
     
    <div
      v-else
      class="space-y-6 flex-1 overflow-y-auto"
    >

      <div v-if="activeTab === 'properties'">
        <!-- ========================= -->
      <!-- Node ID -->
      <!-- ========================= -->

      <div>
        <label
          class="text-xs font-semibold text-slate-400
                uppercase tracking-wider block mb-1"
        >
          Skill ID
        </label>

        <input
          :value="nodes.length === 1 ? nodes[0].data.skill_id : ''"
          type="text"
          :disabled="nodes.length !== 1"
          :placeholder="
            nodes.length > 1
              ? 'Cannot edit Skill ID'
              : 'Example：fireball'
          "
          class="w-full px-3 py-2 bg-slate-900 rounded
                border border-slate-700 text-slate-100
                font-mono text-sm
                focus:outline-none focus:border-emerald-500
                disabled:opacity-50
                disabled:cursor-not-allowed"
          @change="
            updateNodeId(
              ($event.target as HTMLInputElement).value
            )
          "
        />
      </div>

      <!-- ========================= -->
      <!-- Label(名稱) -->
      <!-- ========================= -->

      <div>
        <label
          class="text-xs font-semibold text-slate-400
                 uppercase tracking-wider block mb-1"
        >
          Name
        </label>

        <input
          :value="labelValue()"
          type="text"
          :placeholder="
            nodes.length > 1 && labelValue() === ''
              ? 'Skills have different name'
              : ''
          "
          class="w-full px-3 py-2 bg-slate-900 rounded
                 border border-slate-700 text-slate-100
                 focus:outline-none focus:border-emerald-500
                 text-sm"
          @input="
            updateProperty(
              'label',
              ($event.target as HTMLInputElement).value
            )
          "
        />
      </div>

      <!-- ========================= -->
      <!-- 天賦描述 -->
      <!-- ========================= -->
      <div>

        
        <label
          class="text-xs font-semibold text-slate-400
                uppercase tracking-wider block mb-1"
        >
          Description
        </label>

        <textarea
          :value="getCommonValue('description')"
          
          rows="4"
          :placeholder="
            nodes.length > 1 && getCommonValue('description') === ''
              ? 'Skills have different description'
              : 'Skill Description...'
          "
          class="w-full px-3 py-2 bg-slate-900 rounded
                border border-slate-700 text-slate-100
                focus:outline-none focus:border-emerald-500
                text-sm resize-none"
          @input="
            updateProperty('description' , 
            String(($event.target as HTMLInputElement).value))
          "
        />
      </div>


      <!-- ========================= -->
      <!-- Cost Per Level -->
      <!-- ========================= -->

      <div>
        <label
          class="text-xs font-semibold text-slate-400
                uppercase tracking-wider block mb-1"
        >
          Cost per skill level
        </label>

        <input
          :value="getCommonNumberValue('costPerLevel')"
          type="number"
          min="0"
          step="1"
          :placeholder="
            nodes.length > 1 && getCommonNumberValue('costPerLevel') === ''
              ? 'Skills have different cost'
              : 'Example：1'
          "
          class="w-full px-3 py-2 bg-slate-900 rounded
                border border-slate-700 text-slate-100
                focus:outline-none focus:border-emerald-500
                text-sm"
          @input="
            updatePropertyNumber(
              'costPerLevel',
              Number(($event.target as HTMLInputElement).value)
            )
          "
        />
      </div>


      <!-- ========================= -->
      <!-- Max Level -->
      <!-- ========================= -->

      <div>
        <label
          class="text-xs font-semibold text-slate-400
                uppercase tracking-wider block mb-1"
        >
          Max Level
        </label>

        <input
          :value="getCommonNumberValue('maxLevel')"
          type="number"
          min="1"
          step="1"
          :placeholder="
            nodes.length > 1 && getCommonNumberValue('maxLevel') === ''
              ? 'Skills have different Max Level'
              : 'Example'
          "
          class="w-full px-3 py-2 bg-slate-900 rounded
                border border-slate-700 text-slate-100
                focus:outline-none focus:border-emerald-500
                text-sm"
          @input="
            updatePropertyNumber(
              'maxLevel',
              Math.max(
                1,
                Number(($event.target as HTMLInputElement).value) || 1
              )
            )
          "
        />
      </div>


      <div class="mt-4">
        
        <label
          class="text-xs font-semibold text-slate-400
                uppercase tracking-wider block mb-1"
        >
          Custom Property
        </label>
        <div class="flex gap-2 px-2 text-[10px] text-slate-500 uppercase">
          <span class="flex-1">Key</span>
          <span class="flex-1">Value</span>
          <span class="w-6"></span>
        </div>
        
        <div
          class="max-h-96 overflow-y-auto
                pr-1 space-y-2"
        >
          <div
            v-for="(property, index) in nodes[0].data.kvs"
            :key="index"
            class="flex gap-2"
          >
            <!-- Key -->
            <input
              v-model="property.key"
              type="text"
              placeholder="Key"
              class="min-w-0 flex-1 px-2 py-2
                    bg-slate-900 rounded
                    border border-slate-700
                    text-slate-100 text-sm
                    focus:outline-none
                    focus:border-emerald-500"
            />

            <!-- Value -->
            <input
              v-model="property.value"
              type="text"
              placeholder="Value"
              class="min-w-0 flex-1 px-2 py-2
                    bg-slate-900 rounded
                    border border-slate-700
                    text-slate-100 text-sm
                    focus:outline-none
                    focus:border-emerald-500"
            />

            <!-- Remove -->
            <button
              type="button"
              class="px-2 text-slate-500
                    hover:text-red-400"
              @click="removeCustomProperty(nodes[0] , index)"
            >
              ×
            </button>
          </div>
        </div>

        <button
          type="button"
          class="w-full mt-2 py-2
                border border-dashed border-slate-700
                rounded text-sm text-slate-400
                hover:text-slate-200
                hover:border-slate-500"
          @click="addCustomProperty(nodes[0])"
        >
          + Add Custom Property
        </button>
      </div>
    </div>


    <!-- 樣式 -->
    <div v-else class="flex flex-col gap-2">
      <!-- Icon -->
      <!-- Shape -->
      <!-- Color -->
       <!-- ========================= -->
      <!-- Icon -->
      <!-- ========================= -->

      <div>
        <label
          class="text-xs font-semibold text-slate-400
                 uppercase tracking-wider block mb-1"
        >
          Icon
        </label>
        <!-- Icon 選擇 -->
        <div
          class="grid grid-cols-5 gap-2 max-h-80
                 overflow-y-auto p-1 bg-slate-900/50
                 rounded border border-slate-700
                 
                 "
        >
          <button
            v-for="iconName in iconOptions"
            :key="iconName"
            class="p-2 bg-slate-700 hover:bg-emerald-600
                   rounded transition flex items-center
                   justify-center border border-slate-600
                   aspect-square "
            :class="{
              '!bg-emerald-600 !border-emerald-400':
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
      <!-- Shape 選擇區 -->
      <div>
        <label
          class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1"
        >
          Shape
        </label>

        <div
          class="
            grid
            grid-cols-3
            gap-2
            p-1
            bg-slate-900/50
            rounded
            border
            border-slate-700
          "
        >
          <button
            v-for="shape in shapeOptions"
            :key="shape.value"
            type="button"
            class="
              h-20
              bg-slate-700
              hover:bg-emerald-600
              rounded
              transition
              flex
              flex-col
              items-center
              justify-center
              gap-1
              border
              border-slate-600
            "
            :class="{
              '!bg-emerald-600 !border-emerald-400':
                currentShape === shape.value
            }"
            @click="updateProperty('shape', shape.value)"
          >

            <!-- Shape Preview -->
            <div
              class="w-10 h-10 bg-slate-300"
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
              {{ shape.label }}
            </span>

          </button>
        </div>
      </div>
      <!-- ========================= -->
      <!-- Background Color -->
      <!-- ========================= -->

      <div>
        <label
          class="text-xs font-semibold text-slate-400
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
            class="flex-1 px-3 py-1.5 bg-slate-900
                   rounded border border-slate-700
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
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="color in presetColors"
            :key="color"
            class="w-7 h-7 rounded-full
                   border border-slate-600
                   transition-transform
                   hover:scale-110 active:scale-95"
            :style="{ backgroundColor: color }"
            @click="updateProperty('backgroundColor', color)"
          />
        </div>
      </div>
    </div>

      

      

    </div>
  </div>
</template>
```
