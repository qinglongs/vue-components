<script setup lang="ts">

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import VirtualList from "packages/auto-virtual-list/index.vue";


const arr = new Array(100).fill(0).map((_, index) => index);
const getaList = ({ page, size }: { page: number; size: number }) => {
  const list = arr.slice(page * size - size, page * size);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: list, total: arr.length });
    }, 1000);
  });
};

</script>

<template>
  <div class="box">
    <VirtualList :get-list="getaList"  />
  </div>
</template>

<style>
.box {
  height: 60vh;
  width: 800px;
  margin: 0 auto;
}
</style>
