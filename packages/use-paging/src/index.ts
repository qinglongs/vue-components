import { reactive, ref } from 'vue';

type GetList = <T = any, R = any>(params: { page: number, size: number } & T) => Promise<R>

type Options<E, R> = {
  formatResponseData: (data: R) => { total: number, data: any[] };
  extraParams?: E;
  isPaging: boolean;
}

const arr = new Array(1000).fill(0).map((_, index) => index);

export const getaList = ({ page, size }: { page: number, size: number }) => {
  const list = arr.slice(page * size - size, page * size)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: list, total: arr.length })
    }, 2000)
  })
}

function useScrollList<R = any, E = any>(options: Options<E, R>) {


  const { formatResponseData, extraParams, isPaging } = options;

  const pagingParams = reactive({
    page: 1,
    size: 10
  });

  let dataSource: any[] = [];
  const loading = ref(false);

  /**
* @method 请求分页数据
*/
  const fetchPagingList = async (init = false) => {
    if (loading.value) return Promise.reject();
    console.log(pagingParams.page, pagingParams.size);
    if (!init) {
      pagingParams.page++;
    }
    loading.value = true;
    const tmp = await getaList({ page: pagingParams.page, size: pagingParams.size, ...extraParams });

    const { total, data } = formatResponseData(tmp as R);
    // 还有更多
    const hasMore = pagingParams.page * pagingParams.size < total;
    // 更新数据
    Array.prototype.push.apply(dataSource, data);
    loading.value = false;
    return { hasMore, dataSource }
  };

  return { fetchPagingList,loading }
}

export default useScrollList;