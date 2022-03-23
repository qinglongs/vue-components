import { GetList } from 'use-scroll-paging';
declare type Option<T, R> = {
    swiper: boolean;
    extraParams?: T;
    formatResponseData?: (data: R) => any;
};
declare const useVirtualList: <T, R>(getList: GetList, itemHeight: number, option?: Option<T, R>) => {
    total: import("vue").Ref<number>;
    pagingParams: {
        page: number;
        size: number;
    };
    totalList: import("vue").Ref<never[]>;
    hasMore: import("vue").Ref<boolean>;
    loading: import("vue").Ref<boolean>;
    renderListRef: import("vue").Ref<HTMLElement | undefined>;
    renderList: import("vue").Ref<any[]>;
    containerRef: import("vue").Ref<HTMLElement | undefined>;
    placeholderRef: import("vue").Ref<HTMLElement | undefined>;
    onScroll: () => Promise<void>;
    mousemove: () => void;
    mouseleave: () => void;
};
export default useVirtualList;
