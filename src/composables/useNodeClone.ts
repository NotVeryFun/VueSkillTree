import type { SkillGraphNode, SkillNodeCustomProperty } from "@/type/SkillNode";
import type { XYPosition } from "@vue-flow/core";

function createNodeId(){
    return `n_${Date.now()}`

}


export function cloneNode(sourceNode : SkillGraphNode , position : XYPosition){
    const id = createNodeId()
    if(sourceNode.data.kvs == undefined){
        sourceNode.data.kvs = []
    }
    const newNode = {
        ...sourceNode,
        id:id,
        position:position,
        data:{
        ...sourceNode.data,
        skill_id : id,
        kvs : sourceNode.data.kvs.map((kv : SkillNodeCustomProperty) => {return kv})


        }
    } as SkillGraphNode;
    return newNode
}