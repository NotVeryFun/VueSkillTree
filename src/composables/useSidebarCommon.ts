import { computed, type Ref } from 'vue'
import type { SkillGraphNode, SkillNodeData } from '../type/SkillNode'

/**
 * 多選時取共同屬性值,有人不一樣就回傳 fallback ('')。
 * 取代 Sidebar 內三份手寫迴圈。
 */
export function useSidebarCommonValues(nodes: Ref<SkillGraphNode[]>) {
  const getCommon = <K extends keyof SkillNodeData>(property: K): SkillNodeData[K] | '' => {
    if (nodes.value.length === 0) return ''
    const first = nodes.value[0].data[property]
    const allSame = nodes.value.every((node) => node.data[property] === first)
    if (!allSame) return ''
    return first ?? ''
  }

  const getCommonString = (property: keyof SkillNodeData): string => {
    const value = getCommon(property)
    return typeof value === 'string' ? value : ''
  }

  const getCommonNumber = (property: keyof SkillNodeData, emptyDefault: number | '' = ''): number | '' => {
    if (nodes.value.length === 0) return emptyDefault
    const values = nodes.value.map((node) => node.data[property])
    if (values.every((value) => value === undefined || value === null)) return 1
    const first = values[0]
    if (values.some((value) => value !== first)) return ''
    return typeof first === 'number' ? first : ''
  }

  const currentShape = computed(() => {
    if (nodes.value.length === 0) return ''
    const firstShape = nodes.value[0].data.shape ?? 'rounded-rectangle'
    const allSame = nodes.value.every(
      (node) => (node.data.shape ?? 'rounded-rectangle') === firstShape,
    )
    return allSame ? firstShape : ''
  })

  return { getCommonString, getCommonNumber, currentShape }
}
