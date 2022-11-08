import { Type } from "@sinclair/typebox";
import { FastifyRequestTypebox, Response } from "../../../../types/Server";
import { successJSON } from "../../internal/utils/response-json";
import { SMS, SMSUtils } from "../../../../utils/SMS";
import { RedisKey } from "../../../../utils/Redis";
import RedisService from "../../../../thirdPartyService/RedisService";
import { MessageExpirationSecond, MessageIntervalSecond } from "./Constants";

export const sendMessageSchema = {
    body: Type.Object({
        phone: Type.String({
            format: "phone",
        }),
    }),
};

/** 检测该电话号码是否已发送消息 */
const canSend = async (phone: string): Promise<boolean> => {
    //
    const ttl = await RedisService.ttl(RedisKey.phoneLogin(phone));
    if (ttl < 0) {
        return true;
    }
    const elapsedTime = MessageExpirationSecond - ttl;
    return elapsedTime > MessageIntervalSecond;
};

export const sendMessage = async (
    req: FastifyRequestTypebox<typeof sendMessageSchema>,
): Promise<Response> => {
    const { phone } = req.body;
    const sms = new SMS(phone);
    // 去掉 +86 区域前缀，得到真实手机号
    const safePhone = SMSUtils.safePhone(phone);
    console.log("1111111===", safePhone);
    // if (await canSend(safePhone)) {
    // }

    return successJSON({});
};
