import { EntityManager } from "typeorm";
import { RoomUserDAO } from "../../dao";
import cryptoRandomString from "crypto-random-string";

export class RoomUserService {
    constructor(
        private readonly DBTransaction: EntityManager,
        private readonly roomUUID: string,
        private readonly userUUID: string,
    ) {}

    public async create(): Promise<void> {
        await RoomUserDAO.insert(this.DBTransaction, {
            room_uuid: this.roomUUID,
            user_uuid: this.userUUID,
            // 6位数的随机数字字符串
            rtc_uid: cryptoRandomString({ length: 6, type: "numeric" }),
        });
    }
}
