import { Server } from "../../../utils/RegistryRouters";
import { PhoneSMS, WeChat, Github } from "../../../constants/Config";
import { sendMessage, sendMessageSchema } from "./phone/SendMessage";
import { phoneLogin, phoneLoginSchema } from "./phone/Phone";
import { setAuthUUID, setAuthUUIDSchema } from "./SetAuthUUID";
import { githubCallback, githubCallbackSchema } from "./github/Callback";
import { wechatWebCallback, wechatWebCallbackSchema } from "./weChat/web/Callback";
import { loginProcess, loginProcessSchema } from "./Process";
import { login, loginSchema } from "./Login";

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
    // 微信扫码回调
    server.get("login/github/callback", githubCallback, {
        schema: githubCallbackSchema,
        auth: false,
        enable: Github.enable,
    });
    // 微信扫码回调
    server.get("login/weChat/web/callback", wechatWebCallback, {
        schema: wechatWebCallbackSchema,
        auth: false,
        enable: WeChat.web.enable,
    });
    // 扫码成功后获取登录信息
    server.post("login/process", loginProcess, {
        schema: loginProcessSchema,
        auth: false,
    });
    // 进入首页获取登录信息
    server.post("login", login, {
        schema: loginSchema,
        auth: true,
    });
};
