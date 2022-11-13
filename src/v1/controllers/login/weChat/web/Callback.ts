import { Type } from "@sinclair/typebox";
import { FastifyReply } from "fastify";
import { FastifyRequestTypebox } from "../../../../../types/Server";
import { wechatCallback } from "../Utils";

export const wechatWebCallbackSchema = {
    querystring: Type.Object(
        {
            state: Type.String({
                format: "uuid-v4",
            }),
            code: Type.String({
                minLength: 1,
                maxLength: 50,
            }),
        },
        {
            additionalProperties: false,
        },
    ),
};

export const wechatWebCallback = async (
    req: FastifyRequestTypebox<typeof wechatWebCallbackSchema>,
    reply: FastifyReply,
): Promise<void> => {
    void reply.headers({
        "content-type": "text/html",
    });
    void reply.send();
    const { state: authUUID, code } = req.query;

    await wechatCallback(req.DBTransaction, code, authUUID, "WEB", reply);
};
