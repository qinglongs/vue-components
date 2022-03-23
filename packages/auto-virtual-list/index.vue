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
        v-for="item in renderList"
        :key="item"
        class="item"
        :style="`height:${itemHeight}px`"
      >
        <div v-if="item === 0" style="background: pink">
          {{ item }}
        </div>

        <div v-else-if="item === renderList.length - 1">
          {{ item }}
        </div>
        <div v-else>{{ item }}</div>
      </div>
    </div>
  </div>

  <div class="status-box">
    <div>
      <span>当前页数：{{ pagingParams.page }}</span>
      <span>展示条数：{{ pagingParams.size }}</span>
      <span>数据总数：{{ totalList.length }}/{{ total }}</span>
    </div>

    <div>请求状态: {{ loading ? "请求中..." : "请求完成" }}</div>

    <div>
      <span> 是否还有更多:{{ hasMore ? "还有更多" : "没有更多" }}</span>
    </div>
    <div>
      <span>渲染数据：{{ renderList }}</span>
    </div>
    <div>
      <span>已加载数据：{{ totalList }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import useVirtualList from "use-auto-virtual-list";

const { itemHeight, getList } = defineProps({
  itemHeight: {
    type: Number,
    default: 150,
  },
  getList: {
    type: Function,
    default: () => {},
  },
});

const {
  pagingParams,
  total,
  totalList,
  loading,
  hasMore,
  renderList,
  mouseleave,
  mousemove,
  onScroll,
  placeholderRef,
  containerRef,
  renderListRef,
} = useVirtualList(getList as any, itemHeight);

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

.status-box {
  position: fixed;
  width: 500px;
  height: 400px;
  right: 30px;
  top: 30px;
}

// .virtual-list::-webkit-scrollbar {
//   /*滚动条整体样式*/
//   width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
//   height: 1px;
// }
</style>
