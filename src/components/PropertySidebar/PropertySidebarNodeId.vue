


<script setup lang="ts">
    import type { SkillGraphNode } from '@/type/SkillNode';
    import { useVueFlow } from '@vue-flow/core';
import Input from '../ui/input/Input.vue';
    const {
      getNodes,
    } = useVueFlow()


    const props = defineProps<{nodes: SkillGraphNode[]}>()

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


      //改ID，只能改一個node
      const selectedNode = props.nodes[0]
      
      selectedNode.data.skill_id = trimmedId
    }
</script>
<template>
    <div>
        <label
          class="text-xs font-semibold text-muted-foreground
                uppercase tracking-wider block mb-1"
        >
          Skill ID
        </label>

        <Input
          :value="nodes.length === 1 ? nodes[0].data.skill_id : ''"
          type="text"
          :disabled="nodes.length !== 1"
          :placeholder="
            nodes.length > 1
              ? 'Cannot edit Skill ID'
              : 'Example：fireball'
          "
          class=""
          @update:model-value="(v) =>  
            updateNodeId(
              typeof(v) == 'string' ? v : ''
            )
          "
        />
      </div>
</template>