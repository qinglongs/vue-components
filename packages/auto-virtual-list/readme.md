# 基于 vue3 开发的虚拟滚动(无缝轮播)列表组件

## 何时使用

- 需要在列表中渲染大量数据
- 需要分页展示
- 需要实现无缝滚动自动轮播

## 基本用法

```vue
<VirtualList :get-list="getaList" :item-height="100">
  <template v-slot:default="{item}">
    <div class="list-item">{{ item }}</div>
  </template>
</VirtualList>
```

### API 介绍

| 参数       | 说明                 | 类型                       | 默认值 |
| ---------- | -------------------- | -------------------------- | :----: |
| getList    | 数据请求函数         | (params:any)=>Promise<any> |   -    |
| itemHeight | 列表中单个元素的高度 | number                     |   -    |
| swiper     | 是否自动轮播         | number                     |  true  |
| isPaging   | 是否分页             | boolean                    |  true  |
| formatResponseData   | 格式化返回数据             | (response:any)=> {total:number;data:any[]}                   |  true  |
