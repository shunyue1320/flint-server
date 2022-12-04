import RedisService from "../../../../thirdPartyService/RedisService";
import { RedisKey } from "../../../../utils/Redis";

/** 通过房间 roomUUID 去 redis 拿房间邀请码 */
export const getInviteCode = async (roomUUID: string): Promise<string> => {
    try {
        return (await RedisService.get(RedisKey.roomInviteCodeReverse(roomUUID))) || roomUUID;
    } catch (error) {
        return roomUUID;
    }
};
