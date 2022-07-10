<template>
  <div
    @mousemove="mousemove"
    @mouseleave="mouseleave"
    ref="containerRef"
    @scroll="onScroll"
    class="virtual-list"
  >
    <!-- 占位容器 -->
    <div ref="placeholderRef" class="container"></div>

    <!-- 数据渲染容器 -->
    <div ref="renderListRef" class="list">
      <div v-for="item in renderList" :key="item" class="item">
        <slot v-bind="{ item }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useVirtualList from "use-auto-virtual-list";

type Props = {
  itemHeight: number;
  isPaging: boolean;
  swiper: boolean;
  getList: (params?: Record<string, any>) => Promise<any>;
};

const { itemHeight, getList, isPaging, swiper } = withDefaults(
  defineProps<Props>(),
  {
    itemHeigh: 0,
    isPaging: false,
    swiper: false,
    getList: () => Promise.resolve(),
  }
);

const {
  renderList,
  placeholderRef,
  containerRef,
  renderListRef,
  mouseleave,
  mousemove,
  onScroll,
} = useVirtualList(getList as any,itemHeight, {
  swiper,
  isPaging,
});
</script>

<style lang="less" scoped>
.virtual-list {
  overflow: scroll;
  height: 100%;
  position: relative;

  .list {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #fff;
    width: 100%;
  }
}

.status-box {
  font-size: 30px;
  position: fixed;
  width: 850px;
  right: 30px;
  top: 30px;
}

li {
  margin-bottom: 20px;
}

// .virtual-list::-webkit-scrollbar {
//   /*滚动条整体样式*/
//   width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
//   height: 1px;
// }
</style>
