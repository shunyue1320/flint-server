import { Server } from "../../../utils/RegistryRouters";
import { sendMessage, sendMessageSchema } from "./phone/SendMessage";

export const loginRouters = (server: Server): void => {
    server.post("login/phone/sendMessage", sendMessage, {
        schema: sendMessageSchema,
        enable: true,
    });
};
