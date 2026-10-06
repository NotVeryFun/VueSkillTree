import type { SkillGraphNode, SkillNodeData } from "@/type/SkillNode"

export function usePropertySidebarUtils(){

    function getCommonValue(
        nodes : SkillGraphNode[],
        property: keyof SkillNodeData
    ): string {
        //console.log(nodes.length)
        if (nodes.length === 0) {
            return ''
        }

        const firstValue = nodes[0].data[property]

        const allSame = nodes.every(
            node => node.data[property] === firstValue
        )

        if (!allSame) {
            return ''
        }

        return typeof firstValue === 'string'
            ? firstValue
            : ''
    }


    function getCommonNumberValue(
        nodes : SkillGraphNode[],
        property: keyof SkillNodeData
    ): number | '' {
        if (nodes.length === 0) {
            return ''
        }

        const values = nodes.map(
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

    function getCommonNodeShape(nodes : SkillGraphNode[]){

        if (nodes.length === 0) {
            return ''
        }
        
        const firstShape =
            nodes[0].data.shape ?? 'rounded-rectangle'

        const allSame =
            nodes.every(
            node =>
                (node.data.shape ?? 'rounded-rectangle')
                === firstShape
            )

        return allSame ? firstShape : ''
    }


    return {getCommonValue , getCommonNumberValue , getCommonNodeShape}




}


