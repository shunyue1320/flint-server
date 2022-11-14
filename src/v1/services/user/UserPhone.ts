import { EntityManager } from "typeorm";
import { PhoneSMS } from "../../../constants/Config";
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

    public async exist(): Promise<boolean> {
        return await UserPhoneService.exist(this.DBTransaction, this.userUUID);
    }
    /** 判断该 userUUID 是否绑定了手机 */
    public static async exist(DBTransaction: EntityManager, userUUID: string): Promise<boolean> {
        if (!UserPhoneService.enable) {
            return false;
        }

        const result = await userPhoneDAO.findOne(DBTransaction, "id", {
            user_uuid: userUUID,
        });

        return !!result;
    }

    private static get enable(): boolean {
        return PhoneSMS.enable;
    }

    public async userUUIDByPhone(phone: string): Promise<string | null> {
        return await UserPhoneService.userUUIDByPhone(this.DBTransaction, phone);
    }
    /** 去数据库找该手机号是否注册过 */
    public static async userUUIDByPhone(
        DBTransaction: EntityManager,
        phone: string,
    ): Promise<string | null> {
        const result = await userPhoneDAO.findOne(DBTransaction, ["user_uuid"], {
            phone_number: String(phone),
        });
        return result ? result.user_uuid : null;
    }
}
