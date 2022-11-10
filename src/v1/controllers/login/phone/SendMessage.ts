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

/** 查询 redis 检测该电话号码是否已发送消息, 没有或超过发送间隔返回 true */
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
    // 去掉 +86 区域前缀的+号，得到 "86手机号"
    const safePhone = SMSUtils.safePhone(phone);
    if (await canSend(safePhone)) {
        await sms.send();
        // 发送完成后记录到 redis 缓存中
        await RedisService.set(
            RedisKey.phoneLogin(safePhone),
            sms.verificationCode,
            MessageExpirationSecond,
        );
    }

    return successJSON({});
};
