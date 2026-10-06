<script setup lang="ts">
  import {
    Network,
    Save,
    Gamepad2,
    Import,
  } from 'lucide-vue-next'
  import type { GraphEdge } from '@vue-flow/core';
  import type { SkillGraphNode } from '../type/SkillNode';
  import LoadFileJsonEditorData from './LoadFile/LoadFileJsonEditorData.vue';
  import Dialog from './ui/dialog/Dialog.vue';
  import DialogTrigger from './ui/dialog/DialogTrigger.vue';
  import DialogContent from './ui/dialog/DialogContent.vue';
import DialogHeader from './ui/dialog/DialogHeader.vue';
import DialogFooter from './ui/dialog/DialogFooter.vue';
import ImportTSVDialogContent from './LoadFile/ImportTSVDialogContent.vue';
import DialogTitle from './ui/dialog/DialogTitle.vue';
import OpenFileTSVImportTrigger from './LoadFile/OpenFileTSVImportTrigger.vue';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import type { ImportTSVDataSettings } from '@/type/ImportTSVSettings.ts';
import Button from './ui/button/Button.vue';


  const emit = defineEmits<{
    (e: 'toggle-sidebar'): void
    (e: 'export-json'): void
    (e: 'export-game-data'): void
    (e: 'import-json', data: { nodes: SkillGraphNode[]; edges: GraphEdge[] }): void
    (e: 'import-tsv', data: ImportTSVDataSettings): void
  }>()

  const isTSVImportOpen = ref(false);

  function sendTSVImportedToast(){
    toast('TSV Data has been imported!', {
        description: 'TSV data applied to skill nodes.',
        duration: 4000,
        icon: Import
      })
  }
</script>

<template>
  <nav class="
    fixed
    top-0
    left-0

    w-full
    h-12

    flex
    justify-between
    items-center

    bg-background/20
    backdrop-blur-md
    z-50
    py-0.5
    px-6
  ">
    <!-- ====================================================== -->
    <!-- 左側 -->
    <!-- ====================================================== -->


    <!-- Logo / Title -->
    <div class="flex items-center gap-2.5">

      <Network
        :size="19"
        class="text-emerald-400"
      />

      <span
        class="
          font-semibold
          text-sm
          tracking-wide
          text-slate-100
            truncate
        "
      >
        Skill Editor
      </span>
    </div>


    <div class="flex items-center gap-2">

      <!-- ================================================== -->
      <!-- 儲存編輯器 -->
      <!-- ================================================== -->

      <Button
        class="
          h-full
          flex
          items-center
          gap-2

          rounded-lg

          text-xs
          font-medium

          bg-muted
          text-foreground

          hover:bg-foreground
          hover:text-background

          transition
        "
        title="Save Editor data"
        @click="emit('export-json')"
      >
        <Save :size="15" />

        <span>
          Save Editor Data
        </span>
      </Button>


      <!-- ================================================== -->
      <!-- 匯出遊戲資料 -->
      <!-- ================================================== -->

      


      <!--
        匯入TSV檔案，將Data改變
      -->

      <LoadFileJsonEditorData
      
        @import-data="(data) => emit('import-json' , data)"
        >
      </LoadFileJsonEditorData>





      <Dialog v-model:open="isTSVImportOpen">
        <DialogTrigger as-child>
          <OpenFileTSVImportTrigger></OpenFileTSVImportTrigger>
          <!--LoadFileTSVDataData
          
          
          @import-tsv-data="(data) => emit('import-tsv' , data)">

          </LoadFileTSVDataData-->
        </DialogTrigger>
        <DialogContent class="">
          
            <DialogHeader>
              <DialogTitle>
                Import Settings
              </DialogTitle>
            </DialogHeader>
            
              <ImportTSVDialogContent @import-tsv-data="(data) => {isTSVImportOpen = false ;sendTSVImportedToast(); emit('import-tsv' , data)}">


              </ImportTSVDialogContent>
            
            <DialogFooter>

            </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        class="
          h-full
          flex flex-nowrap
          items-center
          gap-2

          rounded-lg

          bg-emerald-600
          hover:bg-emerald-500

          text-white

          text-xs
          font-semibold

          transition

          shadow-sm
          
        "
        title="Export Skill Tree JSON Data"
        @click="emit('export-game-data')"
      >
        <Gamepad2 :size="15" />

        <span class=" truncate">
          Export Game Data
        </span>
      </Button>
    </div>
  </nav>

</template>