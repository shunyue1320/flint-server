import { EntityManager } from "typeorm";
import { userWeChatDAO } from "../../dao";

export class UserWeChatService {
    constructor(private readonly DBTransaction: EntityManager, private readonly userUUID: string) {}

    public async create(data: {
        userName: string;
        unionUUID: string;
        openUUID: string;
    }): Promise<void> {
        const { userName, unionUUID, openUUID } = data;

        return await userWeChatDAO.insert(this.DBTransaction, {
            user_uuid: this.userUUID,
            user_name: userName,
            union_uuid: unionUUID,
            open_uuid: openUUID,
        });
    }

    public async userUUIDByUnionUUID(unionUUID: string) {
        return await UserWeChatService.userUUIDByUnionUUID(this.DBTransaction, unionUUID);
    }
    /** 查询该微信平台登录用户是否已注册 */
    public static async userUUIDByUnionUUID(
        DBTransaction: EntityManager,
        unionUUID: string,
    ): Promise<string | null> {
        const result = await userWeChatDAO.findOne(DBTransaction, "user_uuid", {
            union_uuid: unionUUID,
        });
        return result ? result.user_uuid : null;
    }
}
