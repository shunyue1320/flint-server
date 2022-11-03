import { Type } from "@sinclair/typebox";

export const sendMessageSchema = {
    body: Type.Object({
        required: ["phone"],
        properties: {
            phone: {
                type: "string",
                format: "phone",
            },
        },
    }),
};

export const sendMessage = async () => {
    return {
        status: 0,
        data: {},
    };
};
