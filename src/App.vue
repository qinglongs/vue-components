<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import VirtualList from "packages/virtual-list/index.vue";
</script>

<template>
  <div class="box">
    <VirtualList  />
  </div>
</template>

<style>
.box {
  height: 60vh;
  width: 800px;
  margin: 0 auto;
}
</style>
