import { RtcRole, RtcTokenBuilder } from "agora-access-token";
import { Agora } from "../../constants/Config";
import RedisService from "../../thirdPartyService/RedisService";
import { RedisKey } from "../../utils/Redis";

/** 通过声网 agora-access-token 库生成 token */
const generateRTCToken = (title: string, uid: number): string => {
    return RtcTokenBuilder.buildTokenWithUid(
        Agora.appId,
        Agora.appCertificate,
        title,
        uid,
        RtcRole.PUBLISHER,
        Math.floor(Date.now() / 1000) + 60 * 60 * 24, // token 有效期 24 小时
    );
};

export const getRTCToken = async (roomUUID: string, rtcUID: number): Promise<string> => {
    // 查询是否存在 token
    const rtcKey = RedisKey.agoraRTCRoomUserToken(roomUUID, rtcUID);
    let rtcToken = await RedisService.get(rtcKey);
    // 不存在就生成 token
    if (rtcToken === null) {
        rtcToken = generateRTCToken(roomUUID, rtcUID);
        await RedisService.set(rtcKey, rtcToken, 60 * 60 * 24 - 60); // 23小时59分过期
    }

    return rtcToken;
};
