import { AbstractLogin } from "../../../../abstract/login";
import { LoginClassParams } from "../../../../abstract/login/Type";
import { QQ } from "../../../../constants/Config";
import { Gender } from "../../../../constants/Project";
import { UserService } from "../../../services/user/User";
import { QQService } from "../../../services/user/UserQQ";
import { ax } from "../../../utils/Axios";

export class LoginQQ extends AbstractLogin {
    public readonly svc: RegisterService;

    constructor(params: LoginClassParams) {
        super(params);
        this.svc = {
            user: new UserService(this.DBTransaction, this.userUUID),
            userQQ: new QQService(this.DBTransaction, this.userUUID),
        };
    }

    /** 创建 user 和 user_qq 表数据 */
    public async register(data: RegisterInfo): Promise<void> {
        await this.svc.user.create(data);
        await this.svc.userQQ.create(data);
    }

    public static async getUserInfoAndToken(
        code: string,
    ): Promise<RegisterInfo & { accessToken: string }> {
        const accessToken = await LoginQQ.getToken(code);
        const openUUID = await LoginQQ.getOpenIdByAPI(accessToken);
        const userInfo = await LoginQQ.getUserInfoByAPI(accessToken, openUUID);

        return {
            openUUID,
            accessToken,
            ...userInfo,
        };
    }

    public static async getToken(code: string): Promise<string> {
        const QQ_CALLBACK = "https://api.guojianbo.top/login/qq/callback";
        const response = await ax.get<AccessToken>(
            `https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=${QQ.clientId}&client_secret=${QQ.clientSecret}&code=${code}&redirect_uri=${QQ_CALLBACK}&fmt=json`,
        );

        return response.data.access_token;
    }

    public static async getOpenIdByAPI(accessToken: string): Promise<string> {
        const response = await ax.get<OpenUUID>(
            `https://graph.qq.com/oauth2.0/me?access_token=${accessToken}&fmt=json`,
        );

        return response.data.openid;
    }

    public static async getUserInfoByAPI(
        accessToken: string,
        openUUID: string,
    ): Promise<QQUserInfo> {
        const response = await ax.get<QQUserResponse>(
            `https://graph.qq.com/user/get_user_info?access_token=${accessToken}&oauth_consumer_key=${QQ.clientId}&openid=${openUUID}`,
        );

        const { nickname, figureurl_qq_1, gender } = response.data;

        return {
            userName: nickname,
            avatarURL: figureurl_qq_1,
            gender: gender === "男" ? Gender["Man"] : Gender["Woman"],
        };
    }
}

interface RegisterService {
    user: UserService;
    userQQ: QQService;
}

interface RegisterInfo {
    userName: string;
    avatarURL: string;
    openUUID: string;
    gender: Gender;
}

interface AccessToken {
    access_token: string;
}

interface OpenUUID {
    openid: string;
}

interface QQUserInfo {
    userName: string;
    avatarURL: string;
    gender: Gender;
}

interface QQUserResponse {
    nickname: string;
    figureurl_qq_1: string;
    gender: string;
}
