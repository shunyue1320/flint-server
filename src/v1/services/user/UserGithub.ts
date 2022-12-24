import { EntityManager } from "typeorm";
import { userGithubDAO } from "../../dao";

export class GithubService {
    constructor(private readonly DBTransaction: EntityManager, private readonly userUUID: string) {}

    public async create(data: { userName: string; unionUUID: string }): Promise<void> {
        const { userName, unionUUID } = data;

        return await userGithubDAO.insert(this.DBTransaction, {
            user_uuid: this.userUUID,
            user_name: userName,
            union_uuid: unionUUID,
        });
    }

    public static async userUUIDByUnionUUID(
        DBTransaction: EntityManager,
        unionUUID: string,
    ): Promise<string | null> {
        const result = await userGithubDAO.findOne(DBTransaction, ["user_uuid"], {
            union_uuid: String(unionUUID),
        });

        return result ? result.user_uuid : null;
    }
}
