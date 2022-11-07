import { Type } from "@sinclair/typebox";
import { FastifyRequestTypebox, Response } from "../../../../types/Server";
import { successJSON } from "../../internal/utils/response-json";
import { SMS, SMSUtils } from "../../../../utils/SMS";

export const sendMessageSchema = {
    body: Type.Object({
        phone: Type.String({
            format: "phone",
        }),
    }),
};

export const sendMessage = async (
    req: FastifyRequestTypebox<typeof sendMessageSchema>,
): Promise<Response> => {
    const { phone } = req.body;
    const sms = new SMS(phone);
    // 去掉 +86 区域前缀，得到真实手机号
    const safePhone = SMSUtils.safePhone(phone);

    return successJSON({});
};
