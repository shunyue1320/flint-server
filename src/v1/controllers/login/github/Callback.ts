import { Type } from "@sinclair/typebox";
import { FastifyReply } from "fastify";
import { v4 } from "uuid";
import { LoginPlatform } from "../../../../constants/Project";
import { FastifyRequestTypebox } from "../../../../types/Server";
import { GithubService } from "../../../services/user/UserGithub";
import { LoginGithub } from "../platforms/LoginGithub";
import callbackViewEta from "../templates/callback-view.eta";

export const githubCallbackSchema = {
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

export const githubCallback = async (
    req: FastifyRequestTypebox<typeof githubCallbackSchema>,
    reply: FastifyReply,
): Promise<void> => {
    const { state: authUUID, platform, code, error } = req.query;

    assertCallbackParamsNoError(error);

    await LoginGithub.assertHasAuthUUID(authUUID);

    const userInfo = await LoginGithub.getUserInfoAndToken(code, authUUID);

    const userUUIDByDB = await GithubService.userUUIDByUnionUUID(
        req.DBTransaction,
        userInfo.unionUUID,
    );

    const userUUID = userUUIDByDB || v4();

    const loginGithub = new LoginGithub({
        DBTransaction: req.DBTransaction,
        userUUID,
    });

    if (!userUUIDByDB) {
        await loginGithub.register(userInfo);
    }

    const { userName, avatarURL } = !userUUIDByDB
        ? userInfo
        : await loginGithub.svc.user.nameAndAvatar();

    await loginGithub.tempSaveUserInfo(authUUID, {
        name: userName,
        token: await reply.jwtSign({
            userUUID,
            loginSource: LoginPlatform.Github,
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
        throw new Error("回调查询参数未通过github检查");
    }
};
