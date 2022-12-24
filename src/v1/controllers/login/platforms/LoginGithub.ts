import { AbstractLogin } from "../../../../abstract/login";
import { LoginClassParams } from "../../../../abstract/login/Type";
import { Github } from "../../../../constants/Config";
import { UserService } from "../../../services/user/User";
import { GithubService } from "../../../services/user/UserGithub";
import { ax } from "../../../utils/Axios";

export class LoginGithub extends AbstractLogin {
    public readonly svc: RegisterService;

    constructor(params: LoginClassParams) {
        super(params);
        this.svc = {
            user: new UserService(this.DBTransaction, this.userUUID),
            userGithub: new GithubService(this.DBTransaction, this.userUUID),
        };
    }

    /** 创建 */
    public async register(data: RegisterInfo): Promise<void> {
        await this.svc.user.create(data);
        await this.svc.userGithub.create(data);
    }

    public static async getUserInfoAndToken(
        code: string,
        authUUID: string,
    ): Promise<GithubUserInfo & { accessToken: string }> {
        const accessToken = await LoginGithub.getToken(code, authUUID);
        const userInfo = await LoginGithub.getUserInfoByAPI(accessToken);

        return {
            ...userInfo,
            accessToken,
        };
    }

    public static async getToken(code: string, authUUID: string): Promise<string> {
        const response = await ax.post<AccessToken | RequestFailed>(
            `https://github.com/login/oauth/access_token?client_id=${Github.clientId}&client_secret=${Github.clientSecret}&code=${code}&state=${authUUID}`,
            null,
            {
                headers: {
                    accept: "application/json",
                },
            },
        );

        if ("error" in response.data) {
            throw new Error(response.data.error);
        }

        return response.data.access_token;
    }

    public static async getUserInfoByAPI(accessToken: string): Promise<GithubUserInfo> {
        const response = await ax.get<GithubUserResponse | RequestFailed>(
            "https://api.github.com/user",
            {
                headers: {
                    accept: "application/json",
                    Authorization: `token ${accessToken}`,
                },
            },
        );

        if ("error" in response.data) {
            throw new Error(response.data.error);
        }

        const { id, login, avatar_url } = response.data;

        return {
            unionUUID: String(id),
            userName: login,
            avatarURL: avatar_url,
        };
    }
}

interface RegisterService {
    user: UserService;
    userGithub: GithubService;
}

interface RegisterInfo {
    userName: string;
    avatarURL: string;
    unionUUID: string;
    accessToken: string;
}

interface GithubUserInfo {
    userName: string;
    avatarURL: string;
    unionUUID: string;
}

interface AccessToken {
    access_token: string;
}

interface RequestFailed {
    error: string;
    error_description: string;
}

interface GithubUserResponse {
    id: number;
    avatar_url: string;
    login: string;
}
