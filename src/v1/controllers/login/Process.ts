import { Type } from "@sinclair/typebox";
import { AbstractLogin } from "../../../abstract/login";
import { Status } from "../../../constants/Project";
import RedisService from "../../../thirdPartyService/RedisService";
import { FastifyRequestTypebox, Response } from "../../../types/Server";
import { RedisKey } from "../../../utils/Redis";

export const loginProcessSchema = {
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

export const loginProcess = async (
    req: FastifyRequestTypebox<typeof loginProcessSchema>,
): Promise<Response<ResponseType>> => {
    const { authUUID } = req.body;

    await AbstractLogin.assertHasAuthUUID(authUUID);
    const userInfoStr = await RedisService.get(RedisKey.authUserInfo(authUUID));

    if (userInfoStr === null) {
        return {
            status: Status.Success,
            data: {
                name: "",
                avatar: "",
                userUUID: "",
                token: "",
                hasPhone: false,
            },
        };
    }

    const userInfo = JSON.parse(userInfoStr);
    return {
        status: Status.Success,
        data: userInfo,
    };
};

interface ResponseType {
    name: string;
    avatar: string;
    userUUID: string;
    token: string;
    hasPhone: boolean;
}
