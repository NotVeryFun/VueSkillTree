
<script setup lang="ts">
import { Import } from 'lucide-vue-next';
import Button from '../ui/button/Button.vue';

        

    

</script>

<template>

    <Button
        class="
          h-full
          flex
          items-center
          gap-2

          rounded-lg

          bg-blue-600
          hover:bg-blue-500

          text-white

          text-xs
          font-semibold

          transition

          shadow-sm
        "
        title="Load editor state from saved editor data"
      >
        <Import :size="15" />
        <span>Import TSV Data</span>
      </Button>
      <!-- Hidden File Input -->

      

</template>