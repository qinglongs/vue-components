declare type Options<E, R> = {
    formatResponseData: (data: R) => {
        total: number;
        data: any[];
    };
    extraParams?: E;
    isPaging: boolean;
};
export declare const getaList: ({ page, size }: {
    page: number;
    size: number;
}) => Promise<unknown>;
declare function useScrollList<R = any, E = any>(options: Options<E, R>): {
    scrollToBottom: () => Promise<{
        total: number;
        data: any[];
        hasMore: boolean;
    }>;
};
export default useScrollList;