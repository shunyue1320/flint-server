import { EntityManager } from "typeorm";
import { userPhoneDAO } from "../../dao";

export class UserPhoneService {
    constructor(private readonly DBTransaction: EntityManager, private readonly userUUID: string) {}

    public async create(data: { userName: string; phone: string }): Promise<void> {
        const { userName, phone } = data;

        return await userPhoneDAO.insert(this.DBTransaction, {
            user_uuid: this.userUUID,
            user_name: userName,
            phone_number: phone,
        });
    }

    // public async userUUIDByPhone(phone: string): Promise<string | null> {
    //     const result = await userPhoneDAO.findOne(this.DBTransaction, ["user_uuid"], {
    //         phone_number: String(phone),
    //     });
    //     return result ? result.user_uuid : null;
    // }
}
