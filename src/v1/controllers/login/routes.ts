import { Server } from "../../../utils/RegistryRouters";
import { PhoneSMS } from "../../../constants/Config";
import { sendMessage, sendMessageSchema } from "./phone/SendMessage";
import { phoneLogin, phoneLoginSchema } from "./phone/Phone";
import { setAuthUUID, setAuthUUIDSchema } from "./SetAuthUUID";

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
    // 前端扫码登录前传递过来的 uuid，扫码后前端拿 uuid 换 token
    server.post("login/set-auth-uuid", setAuthUUID, {
        schema: setAuthUUIDSchema,
        auth: false,
    });
};
