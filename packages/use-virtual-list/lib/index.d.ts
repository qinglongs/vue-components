declare type Option<T, R> = {
    swiper: boolean;
    extraParams?: T;
    formatResponseData?: (data: R) => any;
};
declare const useVirtualList: <T, R>(list: any[], itemHeight: number, option?: Option<T, R>) => {
    renderListRef: import("vue").Ref<HTMLElement | undefined>;
    renderList: import("vue").Ref<any[]>;
    containerRef: import("vue").Ref<HTMLElement | undefined>;
    placeholderRef: import("vue").Ref<HTMLElement | undefined>;
    onScroll: () => Promise<void>;
    mousemove: () => void;
    mouseleave: () => void;
};
export default useVirtualList;
