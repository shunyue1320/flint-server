import { Type } from "@sinclair/typebox";
import { FastifyReply } from "fastify";
import { v4 } from "uuid";
import { LoginPlatform } from "../../../../constants/Project";
import { FastifyRequestTypebox } from "../../../../types/Server";
import { QQService } from "../../../services/user/UserQQ";
import { LoginQQ } from "../platforms/LoginQQ";
import callbackViewEta from "../templates/callback-view.eta";

export const qqCallbackSchema = {
    querystring: Type.Object(
        {
            state: Type.String({
                format: "uuid-v4",
            }),
            code: Type.String(),
            error: Type.Optional(Type.String()),
            platform: Type.Optional(Type.String()),
        },
        {
            additionalProperties: false,
        },
    ),
};

export const qqCallback = async (
    req: FastifyRequestTypebox<typeof qqCallbackSchema>,
    reply: FastifyReply,
): Promise<void> => {
    const { state: authUUID, platform, code, error } = req.query;

    assertCallbackParamsNoError(error);

    await LoginQQ.assertHasAuthUUID(authUUID);

    const userInfo = await LoginQQ.getUserInfoAndToken(code);

    const userUUIDByDB = await QQService.userUUIDByUnionUUID(req.DBTransaction, userInfo.openUUID);

    const userUUID = userUUIDByDB || v4();

    const loginQQ = new LoginQQ({
        DBTransaction: req.DBTransaction,
        userUUID,
    });

    if (!userUUIDByDB) {
        await loginQQ.register(userInfo);
    }

    const { userName, avatarURL } = !userUUIDByDB
        ? userInfo
        : await loginQQ.svc.user.nameAndAvatar();

    await loginQQ.tempSaveUserInfo(authUUID, {
        name: userName,
        token: await reply.jwtSign({
            userUUID,
            loginSource: LoginPlatform.QQ,
        }),
        avatar: avatarURL,
    });

    return await reply.view(callbackViewEta, {
        title: "登录成功",
        needLaunchApp: platform !== "web",
    });
};

/** 断言回调参数无错误 */
const assertCallbackParamsNoError = (error: string) => {
    if (error) {
        throw new Error("回调查询参数未通过qq检查");
    }
};
