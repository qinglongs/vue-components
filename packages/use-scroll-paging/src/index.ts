import { reactive, ref } from "vue";

export type GetList = (params: {
  page?: number;
  size?: number;
  [key: string]: any;
}) => Promise<any>;

type Options<E, R> = {
  formatResponseData?: (data: R) => { total: number; data: any[] };
  extraParams?: E;
  isPaging?: boolean;
};

function useScrollList<R = any, E = any>(
  getList: GetList,
  options: Options<E, R>
) {
  const { formatResponseData, extraParams, isPaging } = options;

  const pagingParams = reactive({
    page: 1,
    size: 10,
  });

  // 数据源，包含完整数据
  const dataSource = ref([]);

  // 还有更多
  const hasMore = ref(true);

  // 节流标志
  const loading = ref(false);

  // total
  const totalNumber = ref(0);

  /**
   * @method 请求分页数据
   * @param init 是否初始化，初始化时不做分页参数不+1
   */
  const fetchPagingList = async (init = false) => {
    // 没有更多
    if (!hasMore.value) {
      return { hasMore: hasMore.value, dataSource: dataSource.value };
    }

    // 节流
    if (loading.value) return Promise.reject();

    if (!init) {
      pagingParams.page++;
    }

    loading.value = true;

    const tmp = await getList({
      page: pagingParams.page,
      size: pagingParams.size,
      ...extraParams,
    });

    const { total, data } = formatResponseData?.(tmp as R) || tmp;
    // 还有更多
    hasMore.value = pagingParams.page * pagingParams.size < total;

    // 数据总数
    totalNumber.value = total;

    // 更新数据
    Array.prototype.push.apply(dataSource.value, data);

    loading.value = false;

    return { hasMore: hasMore.value, dataSource: dataSource.value };
  };

  /**
   * @method 请求分页数据
   */
  const fetchNormalList = async () => {
    // 没有更多
    if (!hasMore.value) {
      return { hasMore: hasMore.value, dataSource: dataSource.value };
    }
    // 节流
    if (loading.value) return Promise.reject();

    loading.value = true;

    const tmp = await getList(extraParams!);

    const list = formatResponseData?.(tmp as R) || tmp;
    // 还有更多
    hasMore.value = false;

    // 数据总数
    totalNumber.value = list.length;

    // 更新数据
    dataSource.value = list;

    loading.value = false;

    return { hasMore: hasMore.value, dataSource: dataSource.value };
  };

  const fetchList = (init = false) => {
    console.log('xxxx');
    
    return isPaging ? fetchPagingList(init) : fetchNormalList();
  };

  return {
    fetchPagingList:fetchList,
    hasMore,
    total: totalNumber,
    dataSource: dataSource,
  };
}

export default useScrollList;
