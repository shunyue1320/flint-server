import { sendMessage, sendMessageSchema } from "./phone/SendMessage";

export const loginRouters = (server): void => {
    server.post("login/phone/sendMessage", sendMessage, {
        schema: sendMessageSchema,
        enable: true,
    });
};
