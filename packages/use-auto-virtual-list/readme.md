### vue3虚拟滚动列表hook

> 提供能力
  - 分页加载
  - 虚拟滚动
  - 自动轮播
  - 无缝滚动
  - 大数据列表渲染

> 使用方式

```ts

 const {
  // 数据总数
  total,
  // 分页参数
  pagingParams,
  // 还有更多
  hasMore,
  // loading
  loading,
  // 渲染列表dom节点
  renderListRef,
  // 渲染数组
  renderList,
  // 视口容器节点
  containerRef,
  // 占位容器节点
  placeholderRef,
  // container 滚动事件
  onScroll,
  // container 鼠标事件
  mousemove,
  mouseleave,
      } = useVirtualList(getList, itemHeight,option);
```

> 参数定义

|  参数名称   | 描述  |类型|默认值  |
|  ----  | ----  |----|----|
| getList  | 分页请求函数 |(params:any)=>Promise<any>|必传|
| itemHeight  | 元素高度 |number|-|
|option|扩展配置项| {swiper: boolean;extraParams?: T;formatResponseData?: (data: Response) => any;}|选传|
