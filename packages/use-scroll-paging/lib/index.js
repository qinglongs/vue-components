import { ref, reactive } from 'vue';

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

export { useScrollList as default, getaList };
