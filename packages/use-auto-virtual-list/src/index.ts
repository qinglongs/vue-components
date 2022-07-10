import { ref, onMounted, onUnmounted, reactive } from 'vue';
import useScrollPaging, { GetList } from 'use-scroll-paging';

type Option<T, R> = {
  isPaging?: boolean;
  swiper?: boolean;
  extraParams?: T;
  formatResponseData?: (data: R) => { total: number, data: any[] };
}

const useVirtualList = <T, R>(getList: GetList, itemHeight: number, option: Option<T, R> = { swiper: true }) => {
  // 可视区域容器节点
  const containerRef = ref<HTMLElement>();
  // 内容节点
  const placeholderRef = ref<HTMLElement>();
  // 数据渲染节点
  const renderListRef = ref<HTMLElement>();

  // 铺满一屏需要的数据(动态的)
  const renderList = ref<any[]>([]);
  
  const { fetchPagingList, dataSource: totalList, total } = useScrollPaging(getList, { isPaging: option.isPaging, formatResponseData:option.formatResponseData })

  // 铺满一屏需要的数据量
  let _renderNumber = 0;

  // 定时器id相关
  let _autoScrollTimer: ReturnType<typeof setTimeout>;
  let _autoScrollReFrame = 0;
  let _mouseTime: ReturnType<typeof setTimeout>;

  // 是否下一轮
  let _isNextRound = false;

  // 是否暂停
  let _isPause = false;

  // 滚动条偏移度
  let _offest = 0;

  /**
  * @method 是否已经滚动到底部
  */
  const checkScrollToBottom = async () => {

    const container = containerRef.value as HTMLElement;

    // 是否滚动到最底部 +1是为了弥补手动滚无法正确计算
    const isToBottom =
      +(container.clientHeight + container.scrollTop).toFixed(0) + 1 >= container.scrollHeight;
    
    
    if (isToBottom) {

      // 发起数据请求
      const { hasMore } = option.isPaging ? await fetchPagingList() : { hasMore: false };

      // 分页数据加载完成
      if (!hasMore) {
        if (!_isNextRound) {
          // 第一次触底
          totalList.value = totalList.value.concat(totalList.value.slice(0, _renderNumber));
        } else {
          // 第二次触底重置list
          totalList.value = totalList.value.slice(0, total.value);
        console.log(total.value);
        
          // 重新设置偏移度 无缝滚动的核心计算  超出视窗的元素出现，滚动条才会发生变化
          _offest = itemHeight * _renderNumber - (containerRef.value as HTMLElement).clientHeight;

          // 重新设置容器滚动条高度
          (containerRef.value as HTMLElement).scrollTop = _offest;
        }
        // 是否下一轮
        _isNextRound = !_isNextRound;
      }

      // 设置容器高度
      const placeholderHeight = totalList.value.length * itemHeight + "px";

      (placeholderRef.value as HTMLElement).style.height = placeholderHeight;
    }
  };

  /**
 * @method 计算出屏幕当前展示的数据
 */
  const setScreenrenderList = () => {

    // 当前滚动到的元素位置
    const activeIndex = (_offest / itemHeight) >> 0;

    // 切割数据
    renderList.value = totalList.value.slice(
      activeIndex,
      activeIndex + _renderNumber
    );
    
    // 设置偏移度 开启gpu硬件加速
    (renderListRef.value as HTMLElement).style.transform = `translate3d(0,${activeIndex * itemHeight}px,0)`;
  };

  /**
   *@method 滚动事件
   */
  const onScroll = async () => {
    if (_isPause) {
      _offest = +(containerRef.value as HTMLElement).scrollTop.toFixed(0);
    }
    await checkScrollToBottom();
    await setScreenrenderList();
  };

  /**
   * @method 开启自动滚动
   */
  const startAutoScroll = () => {
    const content = containerRef.value as HTMLElement;
    const { swiper } = option;

    if (!swiper || content.scrollHeight <= content.clientHeight) return;

    clearTimoutId();

    // 滚动完一条数据，停顿一段时间再开始
    if (_offest !== 0 && _offest % itemHeight === 0) {
      _autoScrollTimer = setTimeout(() => {
        startAutoScroll();
      }, 1000);
    } else {
      _autoScrollReFrame = requestAnimationFrame(() => {
        content.scrollTop = _offest;
        startAutoScroll();
      });
    }
    _offest += 1;
  };

  /**
   * @method 清除定时器，关闭自动轮播
   */
  const clearTimoutId = () => {
    clearTimeout(_mouseTime);
    clearTimeout(_autoScrollTimer);
    cancelAnimationFrame(_autoScrollReFrame);
  };

  /**
   * @method 鼠标移入事件
   */
  const mousemove = () => {
    _isPause = true;
    clearTimoutId();
  };

  /**
   * @method 鼠标移出事件
   */
  const mouseleave = () => {
    _isPause = false;
    _mouseTime = setTimeout(() => {
      startAutoScroll();
    }, 200);
  };

  /**
   * @method 初始化
   */
  const init = async () => {

    await fetchPagingList(true);

    // 设置占位容器的高度，即渲染真实的列表的高度
    (placeholderRef.value as HTMLElement).style.height = itemHeight * totalList.value.length + "px";

    // 设置可视区域的展示条数
    _renderNumber = (((containerRef.value as HTMLElement).clientHeight / itemHeight) >> 0) + 2;

    // 设置可视区域的展示数据
    renderList.value = totalList.value.slice(0, _renderNumber);
  };

  // 组件渲染完成
  onMounted(async () => {
    await init();
    startAutoScroll();
  });

  // 组件已销毁
  onUnmounted(() => {
    clearTimoutId();
  })

  return {
    renderListRef,
    renderList,
    containerRef,
    placeholderRef,
    onScroll,
    mousemove,
    mouseleave,
  };
}

export default useVirtualList;