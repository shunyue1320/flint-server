import * as OpenApi from "@alicloud/openapi-client";
import Dysmsapi20170525 from "@alicloud/dysmsapi20170525";
import { customAlphabet } from "nanoid";
import { PhoneSMS } from "../constants/Config";

export class SMSUtils {
    private static nanoID = customAlphabet("0123456789", 6);
    public static isChineseMainland(phone: string): boolean {
        return phone.startsWith("+86");
    }

    public static safePhone(phone: string): string {
        return phone.match(/\d+/g)!.join("");
    }

    public static verificationCode(): string {
        const code = SMSUtils.nanoID();
        // 避免验证码第一项等于0
        if (code[0] === "0") {
            return SMSUtils.verificationCode();
        }
        return code;
    }
}

class SMSClients {
    private static clients = {
        /** 中国大陆 */
        chineseMainland: new Dysmsapi20170525(
            new OpenApi.Config({
                accessKeyId: PhoneSMS.chineseMainland.accessId,
                accessKeySecret: PhoneSMS.chineseMainland.accessSecret,
                endpoint: "dysmsapi.aliyuncs.com",
            }),
        ),
        /** 中国香港、澳门和台湾地区 */
        hmt: new Dysmsapi20170525(
            new OpenApi.Config({
                accessKeyId: PhoneSMS.hmt.accessId,
                accessKeySecret: PhoneSMS.hmt.accessSecret,
                endpoint: "dysmsapi.aliyuncs.com",
            }),
        ),
        /** 全球短信 */
        global: new Dysmsapi20170525(
            new OpenApi.Config({
                accessKeyId: PhoneSMS.global.accessId,
                accessKeySecret: PhoneSMS.global.accessSecret,
                endpoint: "dysmsapi.aliyuncs.com",
            }),
        ),
    };
    public constructor(private phone: string) {}
    public client(): Dysmsapi20170525 {
        // 是中国大陆手机号 返回 中国大陆短信服务客户端
        if (SMSUtils.isChineseMainland(this.phone)) {
            return SMSClients.clients.chineseMainland;
        }
    }
}

export class SMS {
    /** 阿里云 短信服务 客户端 */
    private client: Dysmsapi20170525;
    /** 生成验证码 */
    public verificationCode = SMSUtils.verificationCode();
    /** 日志记录器 */
    // private logger = this.createLoggerSMS();
    public constructor(private phone: string) {
        // 创建阿里云短信服务客户端
        this.client = new SMSClients(this.phone).client();
    }
}
