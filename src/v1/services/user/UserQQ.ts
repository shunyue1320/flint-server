import { EntityManager } from "typeorm";
import { userQQDAO } from "../../dao";

export class QQService {
    constructor(private readonly DBTransaction: EntityManager, private readonly userUUID: string) {}

    public async create(data: {
        userName: string;
        openUUID: string;
        unionUUID: string;
    }): Promise<void> {
        const { userName, openUUID, unionUUID } = data;

        return await userQQDAO.insert(this.DBTransaction, {
            user_uuid: this.userUUID,
            user_name: userName,
            open_uuid: openUUID,
            union_uuid: unionUUID,
        });
    }

    public async userUUIDByUnionUUID(unionUUID: string) {
        return await QQService.userUUIDByUnionUUID(this.DBTransaction, unionUUID);
    }
    /** 查询该qq平台登录用户是否已注册 */
    public static async userUUIDByUnionUUID(
        DBTransaction: EntityManager,
        unionUUID: string,
    ): Promise<string | null> {
        const result = await userQQDAO.findOne(DBTransaction, "user_uuid", {
            union_uuid: unionUUID,
        });
        return result ? result.user_uuid : null;
    }
}
