import { AxiosResponse } from "axios";
import { ax } from "../../../utils/Axios";
import { AbstractLogin } from "../../../../abstract/login";
import { LoginClassParams } from "../../../../abstract/login/Type";
import { WeChat } from "../../../../constants/Config";
import { UserService } from "../../../services/user/User";
import { UserWeChatService } from "../../../services/user/UserWeChat";

export class LoginWechat extends AbstractLogin {
    public readonly svc: RegisterService;

    constructor(params: LoginClassParams) {
        super(params);
        this.svc = {
            user: new UserService(this.DBTransaction, this.userUUID),
            userWeChat: new UserWeChatService(this.DBTransaction, this.userUUID),
        };
    }

    public async register(info: RegisterInfo): Promise<void> {
        await this.svc.user.create(info);
        await this.svc.userWeChat.create(info);
    }

    /** 通过 code 获取微信用户的 token，再通过 token 获取微信用户信息 */
    public static async getUserInfoAndToken(
        code: string,
        type: "WEB" | "MOBILE",
    ): Promise<WeChatUserInfo & WeChatToken> {
        const token = await LoginWechat.getToken(code, type);
        const userInfo = await LoginWechat.getUserInfoByAPI(token.accessToken, token.openUUID);

        return {
            ...userInfo,
            ...token,
        };
    }

    /** 获取token 见：https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html */
    public static async getToken(code: string, type: "WEB" | "MOBILE"): Promise<WeChatToken> {
        const t = type.toLowerCase() as Lowercase<keyof typeof WeChat>;
        const result = await LoginWechat.wechatRequest<WeChatResponseToken>(
            `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WeChat[t].appId}&secret=${WeChat[t].appSecret}&code=${code}&grant_type=authorization_code`,
        );

        return {
            accessToken: result.access_token,
            openUUID: result.openid,
        };
    }

    /** 获取微信用户信息 见： https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Authorized_Interface_Calling_UnionID.html */
    public static async getUserInfoByAPI(
        accessToken: string,
        openUUID: string,
    ): Promise<WeChatUserInfo> {
        const result = await LoginWechat.wechatRequest<WeChatResponseUserInfo>(
            `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openUUID}`,
        );

        return {
            unionUUID: result.unionid,
            userName: result.nickname,
            avatarURL: result.headimgurl,
        };
    }

    public static async wechatRequest<T>(url: string): Promise<T> {
        const response: AxiosResponse<T | WeChatRequestFailed> = await ax.get(url);
        if ("errmsg" in response.data) {
            throw new Error(response.data.errmsg);
        }

        return response.data;
    }
}

interface RegisterService {
    user: UserService;
    userWeChat: UserWeChatService;
}

interface RegisterInfo {
    userName: string;
    avatarURL: string;
    unionUUID: string;
    openUUID: string;
}

interface WeChatUserInfo {
    readonly unionUUID: string;
    readonly userName: string;
    readonly avatarURL: string;
}

interface WeChatToken {
    accessToken: string;
    openUUID: string;
}

interface WeChatResponseToken {
    readonly access_token: string;
    readonly expires_in: string;
    readonly refresh_token: string;
    readonly openid: string;
    readonly scope: string;
    readonly unionid: string;
}

interface WeChatRequestFailed {
    readonly errcode: number;
    readonly errmsg: string;
}

interface WeChatResponseUserInfo {
    readonly openid: string;
    readonly nickname: string;
    readonly sex: 1 | 2;
    readonly province: string;
    readonly city: string;
    readonly country: string;
    readonly headimgurl: string;
    readonly privilege: string[];
    readonly unionid: string;
}
