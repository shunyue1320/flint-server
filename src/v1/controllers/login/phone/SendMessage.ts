import { Type } from "@sinclair/typebox";
import { FastifyRequestTypebox, Response } from "../../../../types/Server";
import { successJSON } from "../../internal/utils/response-json";
import { SMS } from "../../../../utils/SMS";

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
    // return {
    //     status: 0,
    //     data: {},
    // };

    return successJSON({ phone });
};
