<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import Checkbox from '../ui/checkbox/Checkbox.vue';
import Field from '../ui/field/Field.vue';
import FieldContent from '../ui/field/FieldContent.vue';
import FieldLabel from '../ui/field/FieldLabel.vue';
import Input from '../ui/input/Input.vue';


    interface Inputs{

        checkbox_active: boolean,
        modelValue : number
    }

    const emits = defineEmits<{
        (e : 'update:checkbox_active' , payload : boolean) : void,
        (e : 'update:modelValue' , payload : number) : void
    }>()

    const props = defineProps<Inputs>()


    const checkbox_active = useVModel(props , "checkbox_active" ,emits,{
        passive: true

    });

    const modelValue = useVModel(props , "modelValue" ,emits,{
        passive: true

    });



</script>

<template>

    <Field orientation="horizontal" class=" justify-between w-full">
        <div class="flex items-center gap-2">
            <Checkbox v-model:model-value="checkbox_active"></Checkbox>
            <FieldLabel class="truncate">
                <slot>
                    
                </slot>
            </FieldLabel>
        </div>
        <FieldContent class="flex items-end">
            <Input class="w-24"
                min="1" type="number" v-model:model-value="modelValue"
                :disabled="!checkbox_active"
            />
        </FieldContent>
    </Field>
</template>

