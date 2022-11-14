import { LoginClassParams } from "./Type";
import { EntityManager } from "typeorm";
import RedisService from "../../thirdPartyService/RedisService";
import { RedisKey } from "../../utils/Redis";
import { ControllerError } from "../../error/ControllerError";
import { ErrorCode } from "../../error/ErrorCode";
import { UserPhoneService } from "../../v1/services/user/UserPhone";

export abstract class AbstractLogin {
    protected readonly userUUID: string;
    protected readonly DBTransaction: EntityManager;

    protected constructor(params: LoginClassParams) {
        this.userUUID = params.userUUID;
        this.DBTransaction = params.DBTransaction;
    }

    public abstract register(info: any): Promise<void>;

    /** 将其他平台登录的token存储到redis内，前端通过authUUID来获取登录信息 */
    public async tempSaveUserInfo(
        authUUID: string,
        userInfo: Omit<UserInfo, "userUUID"> & { [key in string]: any },
    ): Promise<void> {
        await RedisService.set(
            RedisKey.authUserInfo(authUUID),
            JSON.stringify({
                ...userInfo,
                userUUID: this.userUUID,
                hasPhone: await UserPhoneService.exist(this.DBTransaction, this.userUUID),
            }),
        );
    }

    /** 检查是否存在该 authUUID，不存在响应错误 */
    public static async assertHasAuthUUID(authUUID: string): Promise<void> {
        const result = await RedisService.get(RedisKey.authUUID(authUUID));
        if (result === null) {
            throw new ControllerError(ErrorCode.ParamsCheckFailed);
        }
    }
}

interface UserInfo {
    name: string;
    avatar: string;
    userUUID: string;
    token: string;
}
