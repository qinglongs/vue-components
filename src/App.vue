<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import VirtualList from "packages/auto-virtual-list/index.vue";

const arr = new Array(30).fill(0).map((_, index) => index);
const getaList = ({ page, size }: { page: number; size: number }) => {
  const list = arr.slice(page * size - size, page * size);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: list, total: arr.length });
    });
  });
};
</script>

<template>
  <div class="box">
    <VirtualList :get-list="getaList" :item-height="100">
      <template v-slot:default="{item}">
        <div class="list-item">{{ item }}</div>
      </template>
    </VirtualList>
  </div>
</template>

<style>
.box {
  height: 60vh;
  width: 800px;
  margin-left: 10%;
}
.list-item {
  height: 100px;
  border-bottom: 1px solid #000;
  line-height: 100px;
  text-align: center;
}
</style>
