import { ref, onMounted, onUnmounted } from 'vue';

type Option = {
  swiper: boolean
}

const useVirtualList = (list: any[], itemHeight: number, option: Option = { swiper: true }) => {
  // 可视区域容器节点
  const containerRef = ref<HTMLElement>();
  // 内容节点
  const placeholderRef = ref<HTMLElement>();
  // 数据渲染节点
  const renderListRef = ref<HTMLElement>();

  // 总数据
  const totalList = ref(list);

  // 铺满一屏需要的数据(动态的)
  const renderList = ref<any[]>([]);

  // 铺满一屏需要的数据量
  let _showNumber = 0;

  // 定时器id相关
  let _autoScrollTimer: number | null = null;
  let _autoScrollReFrame = 0;
  let _mouseScrollTimer: number | null = null;

  // 是否下一轮
  let _isNextRound = false;

  // 是否暂停
  let _isPause = false;

  // 滚动条偏移度
  let _offest = 0;

  /**
   *@method 滚动事件
   */
  const onScroll = () => {
    if (_isPause) {
      _offest = +(containerRef.value as HTMLElement).scrollTop.toFixed(0);
    }
    checkScrollToBottom();
    setScreenrenderList();
  };

  /**
   * @method 开启自动滚动
   */
  const startAutoScroll = () => {
      const content = containerRef.value as HTMLElement;
      const { swiper } = option;
      if (!swiper || content.scrollHeight <= content.clientHeight) return;
      
      stopAutoScroll();
      
      // 滚动完一条数据，停顿一段时间再开始
      if (_offest !== 0 && _offest % itemHeight === 0) {
        _autoScrollTimer = setTimeout(() => {
          startAutoScroll();
        }, 500);
      } else {
        _autoScrollReFrame = requestAnimationFrame(() => {
          content.scrollTop = _offest;
          startAutoScroll();
        });
      }
      _offest += 1;
  };

  /**
   * @method 停止自动滚动
   */
  const stopAutoScroll = () => {
    clearTimeout(_mouseScrollTimer as number);
    clearTimeout(_autoScrollTimer as number);
    cancelAnimationFrame(_autoScrollReFrame);
  };

  /**
   * @method 鼠标移入事件
   */
  const mousemove = () => {
    _isPause = true;
    stopAutoScroll();
  };

  /**
   * @method 鼠标移出事件
   */
  const mouseleave = () => {
    _isPause = false;
    _mouseScrollTimer = setTimeout(() => {
      startAutoScroll();
    }, 200);
  };

  /**
   * @method 是否已经滚动到底部
   */
  const checkScrollToBottom = () => {
    const content = containerRef.value as HTMLElement;

    // 是否滚动到最底部 +1是为了弥补手动滚无法正确计算
    const isToBottom =
      +(content.clientHeight + content.scrollTop).toFixed(0) + 1 >= content.scrollHeight;

    if (isToBottom) {
      if (!_isNextRound) {
        // 第一次触底
        totalList.value = [...list, ...list.slice(0, _showNumber)];
      } else {
        // 第二次触底重置list
        totalList.value = list;

        // 重新设置偏移度
        _offest =
          itemHeight * _showNumber -
          (containerRef.value as HTMLElement).clientHeight;

        // 重新设置容器滚动条高度
        (containerRef.value as HTMLElement).scrollTop = _offest;
      }
      // 是否下一轮
      _isNextRound = !_isNextRound;

      // 设置容器高度
      const containerHeight = totalList.value.length * itemHeight + "px";
      (placeholderRef.value as HTMLElement).style.height = containerHeight;
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
      activeIndex + _showNumber
    );

    // 设置偏移度
    (renderListRef.value as HTMLElement).style.transform = `translateY(${activeIndex * itemHeight}px)`;
  };

  /**
   * @method 初始化
   */
  const init = () => {
    // 设置占位容器的高度，即渲染真实的列表的高度
    (placeholderRef.value as HTMLElement).style.height = itemHeight * totalList.value.length + "px";

    // 设置可视区域的展示条数
    _showNumber = (((containerRef.value as HTMLElement).clientHeight / itemHeight) >> 0) + 2;

    // 设置可视区域的展示数据
    renderList.value = totalList.value.slice(0, _showNumber);
  };

  // 组件渲染完成
  onMounted(() => {
    init();
    startAutoScroll();
  });

  // 组件已销毁
  onUnmounted(() => {
    stopAutoScroll();
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