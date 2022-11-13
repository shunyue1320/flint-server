import { FastifyReply } from "fastify";
import { EntityManager } from "typeorm";
import { v4 } from "uuid";
import { userWeChatDAO } from "../../../dao";
import { LoginWechat } from "../platforms/LoginWechat";
import { LoginPlatform } from "../../../../constants/Project";

export const wechatCallback = async (
    DBTransaction: EntityManager,
    code: string,
    authUUID: string,
    type: "WEB" | "MOBILE",
    reply: FastifyReply,
): Promise<WeChatResponse> => {
    await LoginWechat.assertHasAuthUUID(authUUID);
    const userInfo = await LoginWechat.getUserInfoAndToken(code, type);
    // 查询该微信平台登录用户是否已注册
    const { user_uuid: userUUIDByDB } = await userWeChatDAO.findOne(DBTransaction, "user_uuid", {
        union_uuid: userInfo.unionUUID,
    });

    const userUUID = userUUIDByDB || v4();

    const loginWechat = new LoginWechat({
        DBTransaction,
        userUUID,
    });

    // 没有注册，则注册
    if (!userUUIDByDB) {
        await loginWechat.register(userInfo);
    }

    const { userName, avatarURL } = !userUUIDByDB
        ? userInfo
        : (await loginWechat.svc.user.nameAndAvatar())!;

    const jwtToken = await reply.jwtSign({
        userUUID,
        loginSource: LoginPlatform.WeChat,
    });

    await loginWechat.tempSaveUserInfo(authUUID, {
        name: userName,
        token: jwtToken,
        avatar: avatarURL,
    });

    return {
        name: userName,
        avatar: avatarURL,
        userUUID,
        token: jwtToken,
    };
};

interface WeChatResponse {
    name: string;
    avatar: string;
    userUUID: string;
    token: string;
}
