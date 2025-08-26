export type PaginationRequest = {
    total: number;
    currentPage: number;
    totalPage: number;
    size: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}