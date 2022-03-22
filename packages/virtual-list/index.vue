<template>
  <div
    @mousemove="mousemove"
    @mouseleave="mouseleave"
    ref="containerRef"
    @scroll="onScroll"
    class="virtual-list"
  >
    <div ref="placeholderRef" class="container"></div>
    <div ref="renderListRef" class="list">
      <div
        v-for="(item) in renderList"
        :key="item"
        class="item"
        :style="`height:${itemHeight}px`"
      >
        <div v-if="item===0" style="background:pink">
          {{ item }}
        </div>

           <div v-else-if="item===renderList.length-1">
          {{ item }}
        </div>
        <div v-else>{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted} from "vue";

import useVirtualList from "use-auto-virtual-list";

export default defineComponent({
  props: {
    itemHeight: {
      type: Number,
      default: 150,
    },
    list: {
      type: Array,
      default: () => new Array(10).fill(1).map((item, index) => index),
    },
  },
  setup({ itemHeight, list }) {

    onMounted(() => {
      console.log("mouted");
    });

    const virtualListProps = useVirtualList(list, itemHeight);

    return virtualListProps;
  },
});
</script>

<style lang="scss" scoped>
.virtual-list {
  overflow: scroll;
  height: 100%;
  background-color: #eee;
  position: relative;

  .list {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #fff;
    width: 100%;

    .item {
      border-bottom: 1px solid #000;
      color: #000;
      font-size: 40px;
      line-height: 150px;
      text-align: center;
      height: 150px;
    }
  }
}

// .virtual-list::-webkit-scrollbar {
//   /*滚动条整体样式*/
//   width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
//   height: 1px;
// }
</style>
