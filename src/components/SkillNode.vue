```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import '@vue-flow/node-resizer/dist/style.css'

interface SkillNodeCustomData {
  label: string
  icon?: string
  backgroundColor?: string
  maxLevel: number
  costPerLevel: number
}

const props = defineProps<NodeProps<SkillNodeCustomData>>()

const emit = defineEmits<{
  (
    e: 'add-node-from-handle',
    payload: {
      sourceId: string
      position: 'top' | 'bottom' | 'left' | 'right'
    }
  ): void

  (
    e: 'start-skill-connection',
    payload: {
      sourceId: string
      event: PointerEvent
    }
  ): void
}>()



let plusMoved = false
let plusStartX = 0
let plusStartY = 0

const handlePlusPointerDown = (
  event: PointerEvent,
  position: 'top' | 'bottom' | 'left' | 'right'
) => {

  if (event.button !== 0) {
    return
  }

  plusMoved = false

  plusStartX = event.clientX
  plusStartY = event.clientY

  const handleMove = (moveEvent: PointerEvent) => {

    const dx =
      moveEvent.clientX - plusStartX

    const dy =
      moveEvent.clientY - plusStartY

    if (
      Math.abs(dx) > 5 ||
      Math.abs(dy) > 5
    ) {
      plusMoved = true
    }
  }

  const handleUp = () => {

    window.removeEventListener(
      'pointermove',
      handleMove
    )

    window.removeEventListener(
      'pointerup',
      handleUp
    )

    // 沒有移動 → 視為 click
    if (!plusMoved) {

      emit(
        'add-node-from-handle',
        {
          sourceId: props.id,
          position,
        }
      )
    }
  }

  window.addEventListener(
    'pointermove',
    handleMove
  )

  window.addEventListener(
    'pointerup',
    handleUp
  )

  // 開始 connection
  emit(
    'start-skill-connection',
    {
      sourceId: props.id,
      event,
    }
  )
}

// ============================================================
// SVG
// ============================================================

const svgModules = import.meta.glob<{ default: string }>(
  '../assets/SkillIcon/_1_Game/*.svg',
  {
    eager: true,
  }
)

const getIconSrc = (iconName?: string) => {
  if (!iconName) return ''

  const matchKey = Object.keys(svgModules).find((key) =>
    key.endsWith(`/${iconName}`)
  )

  if (matchKey) {
    return svgModules[matchKey].default
  }

  return `/SkillIcon/_1_Game/${iconName}`
}
</script>

<template>
    <div class="
        w-full h-full 
        relative 
        
        flex flex-col items-center
        transition-transform 
        duration-200 
        ease-out 
        hover:scale-105 
        hover:z-20
        
        ">
        <!-- NodeResizer 調整大小控制元件 -->
    <NodeResizer
      :is-resizable="selected"
      :min-width="100"
      :min-height="80"
      :line-style="selected ? { border: '10px solid transparent' } : { display: 'none' }"
      :handle-style="selected ? {
        width: '12px',
        height: '12px',
        padding: '0px',
        background: 'rgb(96 165 250)',
        border: 'none',
        opacity: '1',
        zIndex: 99,
      } : { display: 'none' }"
    />

    <div
        class="relative w-full h-full flex flex-col items-center justify-center p-3 bg-teal-800 text-white rounded-xl transition-colors min-w-[80px] min-h-[80px] box-border"
        :style="{ backgroundColor: data.backgroundColor }"
        >
        <!-- ========================================================= -->
        <!-- 整個 Node 都是 Target -->
        <!-- ========================================================= -->
        <Handle

            id="center-source"
            type="source"
            :position="Position.Top"
            class="center-source-handle"
            />

          <Handle
            
            id="center-target"
            type="target"
            :position="Position.Top"
            class="center-target-handle w-full h-full"
            />

        <!-- ========================================================= -->
        <!-- Node 內容 -->
        <!-- ========================================================= -->
        <div class="relative z-10 w-full h-full flex flex-col items-center justify-center">

            <!-- 白色虛線選取框 -->
            <div
            v-if="selected"
            class="absolute inset-[-15px] border border-dashed border-white pointer-events-none rounded-[16px] z-10"
            />

            <!-- SVG Icon -->
            <div class="w-10 h-10 flex items-center justify-center rounded-lg p-1.5">
            <img
                v-if="data.icon"
                :src="getIconSrc(data.icon)"
                :alt="data.label"
                class="w-full h-full object-contain filter brightness-0 invert drop-shadow"
            />

            <span
                v-else
                class="text-xs text-slate-500"
            >
                無圖示
            </span>
            </div>

            <!-- Label -->
            <div
            class="text-xs font-bold tracking-wide text-slate-100 select-none text-center pointer-events-none break-all"
            >
            {{ data.label }}
            </div>

        </div>


        <!-- ========================================================= -->
        <!-- 四個 + Handle -->
        <!-- ========================================================= -->

        <template v-if="selected">

            <div
                class="plus-handle handle-top nodrag nopan"
                @pointerdown.stop="handlePlusPointerDown($event, 'top')"
                >
                +
                </div>

                <div
                class="plus-handle handle-bottom nodrag nopan"
                @pointerdown.stop="handlePlusPointerDown($event, 'bottom')"
                >
                +
                </div>

                <div
                class="plus-handle handle-left nodrag nopan"
                @pointerdown.stop="handlePlusPointerDown($event, 'left')"
                >
                +
                </div>

                <div
                class="plus-handle handle-right nodrag nopan"
                @pointerdown.stop="handlePlusPointerDown($event, 'right')"
                >
                +
                </div>

        </template>

        </div>
        <div v-if="data.maxLevel > 1" class="absolute -bottom-5 z-20 items-center justify-center px-5 py-1 bg-slate-950/60 border border-slate-300/60 rounded-full shadow-md pointer-events-none select-none">
            <span class="text-[14px] font-mono font-bold flex items-center justify-center text-slate-100 leading-none tracking-tight">
                0/{{ data.maxLevel ?? 1 }}
            </span>
        </div>
    </div>
</template>
```
<style scoped>

/* ============================================================
   Vue Flow Handle 基礎重置
   ============================================================ */

:deep(.vue-flow__handle) {
  min-width: 0 !important;
  min-height: 0 !important;
}


.center-source-handle,
.center-target-handle {
  position: absolute !important;

  top: 50% !important;
  left: 50% !important;

  width: 1px !important;
  height: 1px !important;

  min-width: 1px !important;
  min-height: 1px !important;

  transform: translate(-50%, -50%) !important;

  opacity: 0 !important;

  pointer-events: none !important;

  border: none !important;

  z-index: 0 !important;
}

/* ============================================================
   + Button
   ============================================================ */

.plus-handle {
  position: absolute !important;

  width: 22px !important;
  height: 22px !important;

  background-color: #3b82f6 !important;

  color: white !important;

  border: 2px solid #ffffff !important;

  border-radius: 9999px !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  font-size: 15px !important;
  font-weight: bold !important;
  line-height: 1 !important;

  cursor: crosshair !important;

  z-index: 30 !important;

  user-select: none !important;

  touch-action: none !important;

  transition:
    transform 0.15s ease,
    background-color 0.15s ease;
}

.real-source-handle {
  position: absolute !important;

  top: 50% !important;
  left: 50% !important;

  width: 1px !important;
  height: 1px !important;

  transform: translate(-50%, -50%) !important;

  opacity: 0 !important;

  pointer-events: none !important;

  border: none !important;

  z-index: 0 !important;
}

.plus-handle:hover {
  background-color: #1d4ed8 !important;

  transform: scale(1.25) !important;
}


/* ============================================================
   四個方向
   ============================================================ */

.handle-top {
  top: 0% !important;
  left: 50% !important;

  transform: translate(-50%, -50%) !important;
}

.handle-bottom {
  top: 100% !important;
  left: 50% !important;

  transform: translate(-50%, -50%) !important;
}

.handle-left {
  top: 50% !important;
  left: 0% !important;

  transform: translate(-50%, -50%) !important;
}

.handle-right {
  top: 50% !important;
  left: 100% !important;

  transform: translate(-50%, -50%) !important;
}


/* ============================================================
   Hover
   ============================================================ */

.handle-top:hover {
  transform: translate(-50%, -50%) scale(1.25) !important;
}

.handle-bottom:hover {
  transform: translate(-50%, -50%) scale(1.25) !important;
}

.handle-left:hover {
  transform: translate(-50%, -50%) scale(1.25) !important;
}

.handle-right:hover {
  transform: translate(-50%, -50%) scale(1.25) !important;
}

</style>