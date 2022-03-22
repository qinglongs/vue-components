declare type Option = {
    swiper: boolean;
};
declare const useVirtualList: (list: any[], itemHeight: number, option?: Option) => {
    renderListRef: import("vue").Ref<HTMLElement | undefined>;
    renderList: import("vue").Ref<any[]>;
    containerRef: import("vue").Ref<HTMLElement | undefined>;
    placeholderRef: import("vue").Ref<HTMLElement | undefined>;
    onScroll: () => void;
    mousemove: () => void;
    mouseleave: () => void;
};
export default useVirtualList;
