import { FastifyReply } from "fastify";
import { PhoneSMS } from "../../../constants/Config";
import { LoginPlatform, Status } from "../../../constants/Project";
import { FError } from "../../../error/ControllerError";
import { ErrorCode } from "../../../error/ErrorCode";
import { FastifyRequestTypebox, Response } from "../../../types/Server";
import { UserService } from "../../services/user/User";
import { UserPhoneService } from "../../services/user/UserPhone";

export const loginSchema = null;

export const login = async (
    req: FastifyRequestTypebox<typeof loginSchema>,
    reply: FastifyReply,
): Promise<Response<ResponseType>> => {
    const svc = {
        user: new UserService(req.DBTransaction, req.userUUID),
        userPhone: new UserPhoneService(req.DBTransaction, req.userUUID),
    };

    assertAccess(req.loginSource);

    const { userName, avatarURL } = await svc.user.assertGetNameAndAvatar();

    // 断言是否存在该平台用户
    switch (req.loginSource) {
        case LoginPlatform.Phone: {
            await svc.userPhone.assertExist();
            break;
        }
    }

    return {
        status: Status.Success,
        data: {
            name: userName,
            avatar: avatarURL,
            token: await reply.jwtSign({
                userUUID: req.userUUID,
                loginSource: req.loginSource,
            }),
            userUUID: req.userUUID,
            hasPhone: await svc.userPhone.exist(),
        },
    };
};

/** 检查是否支持该平台登录 */
const assertAccess = (loginSource: string): void => {
    let enable = true;

    switch (loginSource) {
        case LoginPlatform.Phone: {
            enable = PhoneSMS.enable;
            break;
        }
    }

    if (!enable) {
        throw new FError(ErrorCode.UnsupportedPlatform);
    }
};

interface ResponseType {
    name: string;
    avatar: string;
    token: string;
    userUUID: string;
    hasPhone: boolean;
}
