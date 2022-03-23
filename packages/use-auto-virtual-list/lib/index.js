import { ref, reactive, onMounted, onUnmounted } from 'vue';

const arr = new Array(1000).fill(0).map((_, index) => index);
const getaList = ({ page, size }) => {
    const list = arr.slice(page * size - size, page * size);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: list, total: arr.length });
        }, 2000);
    });
};
function useScrollList(options) {
    const { formatResponseData, extraParams, isPaging } = options;
    ref([]);
    const pagingParams = reactive({
        page: 1,
        size: 10
    });
    /**
  * @method 请求分页数据
  */
    const fetchPagingList = async () => {
        const tmp = await getaList({ page: pagingParams.page, size: pagingParams.size, ...extraParams });
        pagingParams.page++;
        const { total, data } = formatResponseData(tmp);
        const hasMore = pagingParams.page * pagingParams.size < total;
        return { total, data, hasMore };
    };
    const scrollToBottom = async () => {
        return fetchPagingList();
    };
    return { scrollToBottom };
}

const useVirtualList = (list, itemHeight, option = { swiper: true }) => {
    // 可视区域容器节点
    const containerRef = ref();
    // 内容节点
    const placeholderRef = ref();
    // 数据渲染节点
    const renderListRef = ref();
    // 总数据
    const totalList = ref(list);
    // 铺满一屏需要的数据(动态的)
    const renderList = ref([]);
    const { scrollToBottom } = useScrollList({ isPaging: true, formatResponseData: (data) => data, });
    // 铺满一屏需要的数据量
    let _showNumber = 0;
    // 定时器id相关
    let _autoScrollTimer;
    let _autoScrollReFrame = 0;
    let _mouseScrollTimer;
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
        const content = containerRef.value;
        // 是否滚动到最底部 +1是为了弥补手动滚无法正确计算
        const isToBottom = +(content.clientHeight + content.scrollTop).toFixed(0) + 1 >= content.scrollHeight;
        if (isToBottom) {
            const { data, hasMore, total } = await scrollToBottom();
            if (!_isNextRound) {
                // 第一次触底
                totalList.value = [...list, ...data];
            }
            else {
                // 第二次触底重置list
                totalList.value = list;
                // 重新设置偏移度
                _offest =
                    itemHeight * _showNumber -
                        containerRef.value.clientHeight;
                // 重新设置容器滚动条高度
                containerRef.value.scrollTop = _offest;
            }
            // 是否下一轮
            _isNextRound = !_isNextRound;
            // 设置容器高度
            const containerHeight = totalList.value.length * itemHeight + "px";
            placeholderRef.value.style.height = containerHeight;
        }
    };
    /**
   * @method 计算出屏幕当前展示的数据
   */
    const setScreenrenderList = () => {
        // 当前滚动到的元素位置
        const activeIndex = (_offest / itemHeight) >> 0;
        // 切割数据
        renderList.value = totalList.value.slice(activeIndex, activeIndex + _showNumber);
        // 设置偏移度
        renderListRef.value.style.transform = `translateY(${activeIndex * itemHeight}px)`;
    };
    /**
     *@method 滚动事件
     */
    const onScroll = async () => {
        if (_isPause) {
            _offest = +containerRef.value.scrollTop.toFixed(0);
        }
        await checkScrollToBottom();
        await setScreenrenderList();
    };
    /**
     * @method 开启自动滚动
     */
    const startAutoScroll = () => {
        const content = containerRef.value;
        const { swiper } = option;
        if (!swiper || content.scrollHeight <= content.clientHeight)
            return;
        clearTimoutId();
        // 滚动完一条数据，停顿一段时间再开始
        if (_offest !== 0 && _offest % itemHeight === 0) {
            _autoScrollTimer = setTimeout(() => {
                startAutoScroll();
            }, 500);
        }
        else {
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
    const clearTimoutId = () => {
        clearTimeout(_mouseScrollTimer);
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
        _mouseScrollTimer = setTimeout(() => {
            startAutoScroll();
        }, 200);
    };
    /**
     * @method 初始化
     */
    const init = () => {
        // 设置占位容器的高度，即渲染真实的列表的高度
        placeholderRef.value.style.height = itemHeight * totalList.value.length + "px";
        // 设置可视区域的展示条数
        _showNumber = ((containerRef.value.clientHeight / itemHeight) >> 0) + 2;
        // 设置可视区域的展示数据
        renderList.value = totalList.value.slice(0, _showNumber);
    };
    // 组件渲染完成
    onMounted(async () => {
        init();
        startAutoScroll();
    });
    // 组件已销毁
    onUnmounted(() => {
        clearTimoutId();
    });
    return {
        renderListRef,
        renderList,
        containerRef,
        placeholderRef,
        onScroll,
        mousemove,
        mouseleave,
    };
};

export { useVirtualList as default };