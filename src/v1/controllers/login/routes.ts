import { Server } from "../../../utils/RegistryRouters";
import { sendMessage, sendMessageSchema } from "./phone/SendMessage";
import { PhoneSMS } from "../../../constants/Config";

export const loginRouters = (server: Server): void => {
    server.post("login/phone/sendMessage", sendMessage, {
        schema: sendMessageSchema,
        auth: false,
        enable: PhoneSMS.enable,
    });
    server.post("login/phone/phone", sendMessage, {
        schema: sendMessageSchema,
        auth: false,
        enable: PhoneSMS.enable,
    });
};
