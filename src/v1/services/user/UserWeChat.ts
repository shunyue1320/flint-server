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

    // public static async userUUIDByUnionUUID(unionUUID: string): Promise<string | null> {
    //     const { user_uuid } = await userWeChatDAO.findOne(this.DBTransaction, "user_uuid", {
    //         union_uuid: unionUUID,
    //     });

    //     return user_uuid ? user_uuid : null;
    // }
}
