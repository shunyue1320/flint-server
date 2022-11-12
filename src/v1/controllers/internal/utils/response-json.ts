import { Status } from "../../../../constants/Project";
import { ErrorCode } from "../../../../error/ErrorCode";
import { ResponseError, ResponseSuccess } from "../../../../types/Server";

export const successJSON = <O>(data: O): ResponseSuccess<O> => {
    return {
        status: Status.Success,
        data,
    };
};

export const failJSON = (code: ErrorCode): ResponseError => {
    return {
        status: Status.Failed,
        code,
    };
};
