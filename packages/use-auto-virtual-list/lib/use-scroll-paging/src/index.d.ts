export declare type GetList = (params: {
    page: number;
    size: number;
    [key: string]: any;
}) => Promise<any>;
declare type Options<E, R> = {
    formatResponseData: (data: R) => {
        total: number;
        data: any[];
    };
    extraParams?: E;
    isPaging: boolean;
};
declare function useScrollList<R = any, E = any>(getList: GetList, options: Options<E, R>): {
    fetchPagingList: (init?: boolean) => Promise<{
        hasMore: boolean;
        dataSource: never[];
    }>;
    loading: import("vue").Ref<boolean>;
    hasMore: import("vue").Ref<boolean>;
    total: import("vue").Ref<number>;
    dataSource: import("vue").Ref<never[]>;
    pagingParams: {
        page: number;
        size: number;
    };
};
export default useScrollList;
