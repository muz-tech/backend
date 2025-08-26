import { PaginationRequest } from "src/types/common";

export type ResponseDto = {
    errorCode: number;
    data: any;
    message: string;
    meta?: PaginationRequest;
}