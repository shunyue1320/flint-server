import { Type } from "@sinclair/typebox";
import { Status } from "../../../constants/Project";
import { ErrorCode } from "../../../error/ErrorCode";
import RedisService from "../../../thirdPartyService/RedisService";
import { FastifyRequestTypebox, Response } from "../../../types/Server";
import { RedisKey } from "../../../utils/Redis";

export const setAuthUUIDSchema = {
    body: Type.Object(
        {
            authUUID: Type.String({
                format: "uuid-v4",
            }),
        },
        {
            additionalProperties: false,
        },
    ),
};

export const setAuthUUID = async (
    req: FastifyRequestTypebox<typeof setAuthUUIDSchema>,
): Promise<Response<ResponseType>> => {
    const { authUUID } = req.body;
    // authUUID 1小时后过期
    const result = await RedisService.set(RedisKey.authUUID(authUUID), "", 60 * 60);

    if (result === null) {
        return {
            status: Status.Failed,
            code: ErrorCode.ServerFail,
        };
    } else {
        return {
            status: Status.Success,
            data: {},
        };
    }
};

interface ResponseType {}
