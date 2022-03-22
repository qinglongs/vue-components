import { ref, reactive } from 'vue';

const arr = new Array(1000).fill(0).map((_, index) => index);
const getaList = ({ page, size }) => {
    console.log('getAlist');
    const list = arr.slice(page * size - size, page * size);
    console.log(list);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: list, total: arr.length });
        }, 2000);
    });
};
function useScrollList(options) {
    const { formatResponseData, extraParams, isPaging } = options;
    const hasMore = ref(true);
    const noData = ref(false);
    const totalList = ref([]);
    const totalNumber = ref(0);
    const pagingParams = reactive({
        page: 1,
        size: 10
    });
    /**
  * @method 请求分页数据
  */
    const fetchPagingList = async () => {
        if (!hasMore || noData)
            return;
        const tmp = await getaList({ page: pagingParams.page, size: pagingParams.size, ...extraParams });
        const { total, data } = formatResponseData(tmp);
        totalList.value = isPaging ? [...totalList.value, ...data] : totalList.value;
        console.log('xxxxxxxx', totalList.value);
        totalNumber.value = isPaging ? total : totalList.value.length;
    };
    const scrollToBottom = async () => {
        await fetchPagingList();
        return {
            list: totalList.value,
            hasMore: hasMore.value,
            total: totalNumber.value,
        };
    };
    return { scrollToBottom };
}

export { useScrollList as default, getaList };
