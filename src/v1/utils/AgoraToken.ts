import { RtcRole, RtcTokenBuilder, RtmRole, RtmTokenBuilder } from "agora-access-token";
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

const generateRTMToken = (uid: string) => {
    return RtmTokenBuilder.buildToken(Agora.appId, Agora.appCertificate, uid, RtmRole.Rtm_User, 0);
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

export const getRTMToken = async (userUUID: string): Promise<string> => {
    // 查询是否存在 token
    const rtmKey = RedisKey.agoraRTMUserToken(userUUID);
    let rtmToken = await RedisService.get(rtmKey);

    // 不存在就生成 token
    if (rtmToken === null) {
        rtmToken = generateRTMToken(userUUID);
        await RedisService.set(rtmKey, rtmToken, 60 * 60 * 24 - 60);
    }

    return rtmToken;
};
