```vue
<script setup lang="ts">
import type { SkillNodeShape } from './SkillNode.vue'
import { computed, ref } from 'vue'
import type { SkillGraphNode, SkillNodeData } from '../type/SkillNode.ts'




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

  (
    e: 'update-property',
    property: keyof SkillNodeData,
    value: string
  ): void

  (
    e: 'update-property-number',
    property: keyof SkillNodeData,
    value: number
  ): void

  (
    e: 'update-node-id',
    nodeId: string,
  ): void
}>()

const getIconUrl = (iconName: string) => {
  if (props.iconUrlMap?.[iconName]) {
    return props.iconUrlMap[iconName]
  }

  return `/SkillIcon/_1_Game/${iconName}`
}

/**
 * 目前是否為單一 Node
 */
const isSingleNode = () => {
  return props.nodes.length === 1
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
  console.log(props.nodes.length)
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
  emit('update-property', property, value)
}

const updatePropertyNumber = (
  property: keyof SkillNodeData,
  value: number
) => {
  emit('update-property-number', property, value)
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


</script>

<template>
  <div
    class="absolute top-14 left-0 h-[calc(100%-3.5rem)] w-80
           bg-slate-800 border-r border-slate-700 shadow-2xl
           z-20 transition-transform duration-0 ease-in-out
           p-5 flex flex-col text-slate-100"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >

    <!-- 標題 -->
    <div
      class="flex items-center justify-between
             pb-4 border-b border-slate-700 mb-6"
    >
      <h2 class="text-lg font-bold flex items-center gap-2">
        <span>⚙️</span>

        <span v-if="isSingleNode()">
          編輯天賦屬性
        </span>

        <span v-else>
          編輯 {{ nodes.length }} 個天賦
        </span>
      </h2>

      <button
        @click="emit('close')"
        class="text-slate-400 hover:text-white p-1
               rounded-md hover:bg-slate-700 transition"
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
        屬性
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
        樣式
      </button>
    </div>

    
    <!-- 沒有選取 Node -->
    <div
      v-if="nodes.length === 0"
      class="flex-1 flex items-center justify-center
             text-slate-500 text-sm"
    >
      尚未選取天賦
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
          Node ID
        </label>

        <input
          :value="nodes.length === 1 ? nodes[0].id : ''"
          @change="
            emit(
              'update-node-id',
              ($event.target as HTMLInputElement).value
            )
          "
          type="text"
          :disabled="nodes.length !== 1"
          :placeholder="
            nodes.length > 1
              ? '多選時無法修改 Node ID'
              : '例如：fireball'
          "
          class="w-full px-3 py-2 bg-slate-900 rounded
                border border-slate-700 text-slate-100
                font-mono text-sm
                focus:outline-none focus:border-emerald-500
                disabled:opacity-50
                disabled:cursor-not-allowed"
        />
      </div>

      <!-- ========================= -->
      <!-- Label -->
      <!-- ========================= -->

      <div>
        <label
          class="text-xs font-semibold text-slate-400
                 uppercase tracking-wider block mb-1"
        >
          天賦名稱 (Label)
        </label>

        <input
          :value="labelValue()"
          @input="
            updateProperty(
              'label',
              ($event.target as HTMLInputElement).value
            )
          "
          type="text"
          :placeholder="
            nodes.length > 1 && labelValue() === ''
              ? '多個 Node 的名稱不同'
              : ''
          "
          class="w-full px-3 py-2 bg-slate-900 rounded
                 border border-slate-700 text-slate-100
                 focus:outline-none focus:border-emerald-500
                 text-sm"
        />
      </div>
      <div>
      <label
        class="text-xs font-semibold text-slate-400
              uppercase tracking-wider block mb-1"
      >
        技能描述
      </label>

      <textarea
        :value="getCommonValue('description')"
        @input="
          updateProperty(
            'description',
            ($event.target as HTMLTextAreaElement).value
          )
        "
        rows="4"
        :placeholder="
          nodes.length > 1 && getCommonValue('description') === ''
            ? '多個 Node 的描述不同'
            : '輸入技能描述...'
        "
        class="w-full px-3 py-2 bg-slate-900 rounded
              border border-slate-700 text-slate-100
              focus:outline-none focus:border-emerald-500
              text-sm resize-none"
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
        每級技能點消耗
      </label>

      <input
        :value="getCommonNumberValue('costPerLevel')"
        @input="
          updatePropertyNumber(
            'costPerLevel',
            Number(($event.target as HTMLInputElement).value)
          )
        "
        type="number"
        min="0"
        step="1"
        :placeholder="
          nodes.length > 1 && getCommonNumberValue('costPerLevel') === ''
            ? '多個 Node 的消耗不同'
            : '例如：1'
        "
        class="w-full px-3 py-2 bg-slate-900 rounded
              border border-slate-700 text-slate-100
              focus:outline-none focus:border-emerald-500
              text-sm"
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
        最大等級
      </label>

      <input
        :value="getCommonNumberValue('maxLevel')"
        @input="
          updatePropertyNumber(
            'maxLevel',
            Math.max(
              1,
              Number(($event.target as HTMLInputElement).value) || 1
            )
          )
        "
        type="number"
        min="1"
        step="1"
        :placeholder="
          nodes.length > 1 && getCommonNumberValue('maxLevel') === ''
            ? '多個 Node 的最大等級不同'
            : '例如：5'
        "
        class="w-full px-3 py-2 bg-slate-900 rounded
              border border-slate-700 text-slate-100
              focus:outline-none focus:border-emerald-500
              text-sm"
      />
    </div>
    </div>

    <div v-else>
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
          Icon SVG 檔名
        </label>

        <input
          :value="iconValue()"
          @input="
            updateProperty(
              'icon',
              ($event.target as HTMLInputElement).value
            )
          "
          type="text"
          placeholder="例如: sword.svg"
          class="w-full px-3 py-2 bg-slate-900 rounded
                 border border-slate-700 text-slate-100
                 focus:outline-none focus:border-emerald-500
                 text-sm mb-3"
        />

        <!-- Icon 選擇 -->
        <div
          class="grid grid-cols-5 gap-2 max-h-48
                 overflow-y-auto p-1 bg-slate-900/50
                 rounded border border-slate-700
                 
                 "
        >
          <button
            v-for="iconName in iconOptions"
            :key="iconName"
            @click="updateProperty('icon', iconName)"
            class="p-2 bg-slate-700 hover:bg-emerald-600
                   rounded transition flex items-center
                   justify-center border border-slate-600
                   aspect-square "
            :class="{
              '!bg-emerald-600 !border-emerald-400':
                iconValue() === iconName
            }"
            :title="iconName"
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
          節點形狀
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
            @click="updateProperty('shape', shape.value)"
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
          節點顏色
        </label>

        <div class="flex items-center gap-2 mb-3">

          <!--
            HTML color input 不支援空值。
            因此只有所有 Node 顏色相同時才顯示 color picker。
          -->
          <input
            v-if="backgroundColorValue() !== ''"
            :value="backgroundColorValue()"
            @input="
              updateProperty(
                'backgroundColor',
                ($event.target as HTMLInputElement).value
              )
            "
            type="color"
            class="w-10 h-9 p-1 bg-slate-900 rounded
                   border border-slate-700 cursor-pointer"
          />

          <!-- Hex -->
          <input
            :value="backgroundColorValue()"
            @input="
              updateProperty(
                'backgroundColor',
                ($event.target as HTMLInputElement).value
              )
            "
            type="text"
            placeholder="#1e293b"
            class="flex-1 px-3 py-1.5 bg-slate-900
                   rounded border border-slate-700
                   text-slate-100 font-mono text-xs
                   focus:outline-none focus:border-emerald-500"
          />
        </div>

        <!-- 快速預設顏色 -->
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="color in presetColors"
            :key="color"
            @click="updateProperty('backgroundColor', color)"
            class="w-7 h-7 rounded-full
                   border border-slate-600
                   transition-transform
                   hover:scale-110 active:scale-95"
            :style="{ backgroundColor: color }"
          />
        </div>
      </div>
    </div>

      

      

    </div>
  </div>
</template>
```
