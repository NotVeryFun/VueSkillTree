


<script setup lang="ts">
    import type { SkillGraphNode, SkillNodeCustomProperty } from '@/type/SkillNode';
import { computed } from 'vue';
import Input from '../ui/input/Input.vue';
    const props = defineProps<{nodes: SkillGraphNode[]}>()


interface CommonProperty {
  key: string
  occurrence: number
  value: string | null
}

function getPropertyOccurrence(
  kvs: SkillNodeCustomProperty[],
): Map<string, number[]> {
  const occurrences = new Map<string, number[]>()

  for (let i = 0; i < kvs.length; i++) {
    const key = kvs[i].key

    if (!occurrences.has(key)) {
      occurrences.set(key, [])
    }

    occurrences.get(key)!.push(i)
  }

  return occurrences
}


const CommonProperties = computed<CommonProperty[]>(() => {
  if (props.nodes.length === 0) {
    return []
  }

  /*
   * 第一個 Node 決定：
   * 1. 哪些 property 可以被共同編輯
   * 2. Property 的顯示順序
   */

  const firstNodeKvs = props.nodes[0].data.kvs ?? []

  /*
   * firstNodeMap:
   *
   * key -> 該 key 在第一個 Node 出現的 index
   *
   * 例如：
   *
   * aa
   * aa
   * bb
   * aa
   *
   * 會得到：
   *
   * aa -> [0, 1, 3]
   * bb -> [2]
   */
  const firstNodeMap = getPropertyOccurrence(firstNodeKvs)

  /*
   * common:
   *
   * 用 "key + occurrence" 當作 property 的真正 identity。
   *
   * 例如：
   *
   * aa #0
   * aa #1
   * bb #0
   *
   * 會使用：
   *
   * "aa\0" + 0
   * "aa\0" + 1
   * "bb\0" + 0
   *
   * 這樣 duplicate key 不會互相覆蓋。
   */
  const common = new Map<
    string,
    {
      key: string
      occurrence: number
      order: number
    }
  >()

  /*
   * 先按照第一個 Node 的順序建立候選 property。
   */
  let order = 0

  for (const [key, indexes] of firstNodeMap) {
    for (let occurrence = 0; occurrence < indexes.length; occurrence++) {
      const identity = `${key}\0${occurrence}`

      common.set(identity, {
        key,
        occurrence,
        order,
      })

      order++
    }
  }

  /*
   * 接下來檢查其他 Node 是否也存在相同的
   * key + occurrence。
   */
  for (let nodeIndex = 1; nodeIndex < props.nodes.length; nodeIndex++) {
    const kvs = props.nodes[nodeIndex].data.kvs ?? []
    const nodeMap = getPropertyOccurrence(kvs)

    for (const [identity, property] of common) {
      const indexes = nodeMap.get(property.key)

      /*
       * 這個 Node 沒有這個 key，
       * 或者這個 key 沒有足夠的 occurrence。
       */
      if (
        indexes === undefined ||
        indexes.length <= property.occurrence
      ) {
        common.delete(identity)
      }
    }
  }

  /*
   * Map 本身雖然通常會維持 insertion order，
   * 但這裡明確按照第一個 Node 的 order 排序，
   * 保證顯示順序穩定。
   */
  return Array.from(common.values())
    .sort((a, b) => a.order - b.order)
    .map(property => ({
      key: property.key,
      occurrence: property.occurrence,
      value: null,
    }))
})


const CommonValues = computed<(string | null)[]>(() => {
  const result: (string | null)[] = []

  for (const property of CommonProperties.value) {
    let commonValue: string | null | undefined = undefined

    for (const node of props.nodes) {
      const kvs = node.data.kvs ?? []

      /*
       * 找到這個 Node 中：
       *
       * key = property.key
       * occurrence = property.occurrence
       *
       * 的 property。
       */
      let occurrence = 0
      let target: SkillNodeCustomProperty | undefined

      for (const kv of kvs) {
        if (kv.key !== property.key) {
          continue
        }

        if (occurrence === property.occurrence) {
          target = kv
          break
        }

        occurrence++
      }

      if (target === undefined) {
        commonValue = null
        break
      }

      if (commonValue === undefined) {
        commonValue = target.value
      } else if (commonValue !== target.value) {
        commonValue = null
        break
      }
    }

    result.push(commonValue ?? null)
  }

  return result
})


function addCustomProperty() {
  for (const node of props.nodes) {
    if (node.data.kvs === undefined) {
      node.data.kvs = []
    }

    node.data.kvs.push({
      key: "",
      value: "",
    })
  }
}


function removeCustomProperty(index: number) {
  const property = CommonProperties.value[index]

  if (property === undefined) {
    return
  }

  for (const node of props.nodes) {
    const kvs = node.data.kvs ?? []

    let occurrence = 0

    for (let i = 0; i < kvs.length; i++) {
      if (kvs[i].key !== property.key) {
        continue
      }

      if (occurrence === property.occurrence) {
        kvs.splice(i, 1)
        break
      }

      occurrence++
    }
  }
}


function updateCommonKeys(
  index: number,
  value: number | string,
) {
  if (typeof value === "number") {
    return
  }

  const property = CommonProperties.value[index]

  if (property === undefined) {
    return
  }

  /*
   * 注意：
   *
   * 這裡不能先把 property.key 改掉，
   * 然後再用新的 key 找 property。
   *
   * property.key / occurrence
   * 是這次修改之前的 identity。
   */
  for (const node of props.nodes) {
    const kvs = node.data.kvs ?? []

    let occurrence = 0

    for (const kv of kvs) {
      if (kv.key !== property.key) {
        continue
      }

      if (occurrence === property.occurrence) {
        kv.key = value
        break
      }

      occurrence++
    }
  }
}


function updateCommonValues(
  index: number,
  value: number | string,
) {
  if (typeof value === "number") {
    return
  }

  const property = CommonProperties.value[index]

  if (property === undefined) {
    return
  }

  for (const node of props.nodes) {
    const kvs = node.data.kvs ?? []

    let occurrence = 0

    for (const kv of kvs) {
      if (kv.key !== property.key) {
        continue
      }

      if (occurrence === property.occurrence) {
        kv.value = value
        break
      }

      occurrence++
    }
  }
}
</script>
<template>
    <div class="mt-4">
  <label
    class="text-xs font-semibold text-muted-foreground
           uppercase tracking-wider block mb-1"
  >
    Custom Property
  </label>

  <div
    class="flex gap-2 px-2 py-0.5
           text-[10px] text-muted-foreground uppercase"
  >
    <span class="flex-1">Key</span>
    <span class="flex-1">Value</span>
    <span class="w-6"></span>
  </div>

  <div class="max-h-96 overflow-y-auto pr-1 space-y-2">
    <div
      v-for="(property, index) in CommonProperties"
      :key="`${index}`"
      class="flex gap-2"
    >
      <Input
        :model-value="property.key"
        @update:model-value="(v) => updateCommonKeys(index, v)"
        placeholder="Key"
        class="min-w-0 flex-1 px-2 py-0.5 rounded border text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
      />

      <Input
        :model-value="
          CommonValues[index] == null
            ? ''
            : CommonValues[index]
        "
        :placeholder="
          nodes.length == 1
            ? 'Value'
            : (
                CommonValues[index] == null
                  ? 'different'
                  : CommonValues[index]
              )
        "
        @update:model-value="(v) => updateCommonValues(index, v)"
        
        class="min-w-0 flex-1 px-2 py-0.5 rounded border text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
      />

      <button
        type="button"
        class="px-2 text-slate-500 hover:text-red-400"
        @click="removeCustomProperty(index)"
      >
        ×
      </button>
    </div>
  </div>

  <button
    type="button"
    class="w-full mt-2 py-2 border border-dashed rounded
           text-sm text-slate-400
           hover:text-slate-200 hover:border-slate-500"
    @click="addCustomProperty()"
  >
    + Add Custom Property
  </button>
</div>
</template>