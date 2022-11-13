import { Server } from "../../../utils/RegistryRouters";
import { PhoneSMS } from "../../../constants/Config";
import { sendMessage, sendMessageSchema } from "./phone/SendMessage";
import { phoneLogin, phoneLoginSchema } from "./phone/Phone";

export const loginRouters = (server: Server): void => {
    server.post("login/phone/sendMessage", sendMessage, {
        schema: sendMessageSchema,
        auth: false,
        enable: PhoneSMS.enable,
    });
    server.post("login/phone", phoneLogin, {
        schema: phoneLoginSchema,
        auth: false,
        enable: PhoneSMS.enable,
    });
};
