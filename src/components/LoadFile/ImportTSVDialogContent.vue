
<script setup lang="ts">
    import { ref } from 'vue';
    import Button from '../ui/button/Button.vue';
    import Field from '../ui/field/Field.vue';
    import FieldGroup from '../ui/field/FieldGroup.vue';
    import FieldSet from '../ui/field/FieldSet.vue';
    import Input from '../ui/input/Input.vue';
    import { Import } from 'lucide-vue-next';
    import type { ImportTSVDataSettings } from '@/type/ImportTSVSettings.ts';
    import FieldLabel from '../ui/field/FieldLabel.vue';
    import FieldContent from '../ui/field/FieldContent.vue';
    import ImportTSVDialogContentInputLine from './ImportTSVDialogContentInputLine.vue';

    const skill_id = ref(1);
    const skill_name = ref(2);
    const skill_description = ref(3);
    const skill_cost_per_level = ref(4);
    const skill_max_level = ref(5);
    const skill_kv_start = ref(6);
    const emits = defineEmits<{

        (e: 'import-tsv-data', data: ImportTSVDataSettings): void
    }>();



    const InputRef = ref<HTMLInputElement | null>(null)

    // ============================================================
    // 匯入
    // ============================================================

    const triggerFileInput = () => {
        InputRef.value?.click()
    }

    const handleFileChange = async (event: Event) => {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]

        if (!file) return

        
        const text = await file.text()
        const rows = text.split('\n').filter((t) => t.trim() != '')
        const width = Object.entries(rows[0].split("\t")).length

        console.log("[ImportTSVDialogContent] width : " , width , Object.entries(rows[0]))
        const data = rows.slice(1).map(row => {

            const t_row = row.split('\t')

        
            const res : Record<number , string> = {}
            for(let i = 0 ; i < width ; i ++){

                res[i] = t_row[i]
            }

            return res;
        })
        const setting : ImportTSVDataSettings = {
            column_number_skill_id : skill_id.value,
            column_number_skill_name : checkbox_skill_name.value ? skill_name.value : -1,  
            column_number_skill_description : checkbox_skill_description.value ? skill_description.value : -1,
            column_number_skill_cost_per_level : checkbox_skill_cost_per_level.value ? skill_cost_per_level.value : -1,
            column_number_skill_max_level : checkbox_skill_max_level.value ? skill_max_level.value : -1,
            column_number_skill_kvs_start : checkbox_skill_kvs_start.value ? skill_kv_start.value : -1,
            data : data
        };

        console.log(setting)
        
        // 確保下次選同一個檔案仍會觸發 change
        emits('import-tsv-data' , setting)
        target.value = ''
    }


    const checkbox_skill_name = ref(true)
    const checkbox_skill_description = ref(true)
    const checkbox_skill_cost_per_level = ref(true)
    const checkbox_skill_max_level = ref(true)
    const checkbox_skill_kvs_start = ref(true)
</script>

<template>
    <FieldGroup>
        <FieldSet>
            <Field orientation="horizontal">
                
                <FieldLabel>Skill Id Column</FieldLabel>
                <FieldContent>
                    <Input min="1" type="number" v-model:model-value="skill_id"/>
                </FieldContent>
            </Field>

            <ImportTSVDialogContentInputLine
                v-model:model-value="skill_name"
                v-model:checkbox_active="checkbox_skill_name"
            >
                Import Name Column Number
            </ImportTSVDialogContentInputLine>

            <ImportTSVDialogContentInputLine
                v-model:model-value="skill_description"
                v-model:checkbox_active="checkbox_skill_description"
            >
                Import Description Column Number
            </ImportTSVDialogContentInputLine>

            <ImportTSVDialogContentInputLine
                v-model:model-value="skill_cost_per_level"
                v-model:checkbox_active="checkbox_skill_cost_per_level"
            >
                Import Cost Column Number
            </ImportTSVDialogContentInputLine>

            <ImportTSVDialogContentInputLine
                v-model:model-value="skill_max_level"
                v-model:checkbox_active="checkbox_skill_max_level"
            >
                Import Max Level Column Number
            </ImportTSVDialogContentInputLine>

            <ImportTSVDialogContentInputLine
                v-model:model-value="skill_kv_start"
                v-model:checkbox_active="checkbox_skill_kvs_start"
            >
                Import KV start Column Number
            </ImportTSVDialogContentInputLine>
   
            <Field>
                <Button @click="triggerFileInput" variant="outline">
                    <Import/>
                    <span>Import</span>
                </Button>
            </Field>
        </FieldSet>
    </FieldGroup>
    <input
        ref="InputRef"
        type="file"
        accept=inputFileType
        class="hidden"
        @change="handleFileChange"
      />
    
</template>