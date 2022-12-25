import packages from "../../package.json";
import { config } from "../utils/parseConfig";

export const isDev = process.env.NODE_ENV === "development";
export const isTest = process.env.IS_TEST === "yes";

export const Server = {
    port: config.server.port,
    name: "flint-server",
    version: packages.version,
    env: config.server.env,
};

export const MySQL = {
    host: config.mysql.host,
    port: config.mysql.port,
    username: config.mysql.username,
    password: config.mysql.password,
    db: config.mysql.db,
};

export const Redis = {
    host: config.redis.host,
    port: config.redis.port,
    username: config.redis.username || "",
    password: config.redis.password,
    db: config.redis.db,
    queueDB: config.redis.queueDB,
};

export const JWT = {
    secret: config.jwt.secret,
    algorithms: config.jwt.algorithms,
};

export const WeChat = {
    web: {
        enable: config.login.wechat.web.enable,
        appId: config.login.wechat.web.app_id,
        appSecret: config.login.wechat.web.app_secret,
    },
};

export const Github = {
    enable: config.login.github.enable,
    clientId: config.login.github.client_id,
    clientSecret: config.login.github.client_secret,
};

export const QQ = {
    enable: config.login.qq.enable,
    clientId: config.login.qq.client_id,
    clientSecret: config.login.qq.client_secret,
};

export const PhoneSMS = {
    enable: config.login.sms.enable,
    testUsers: config.login.sms.test_users.map(user => {
        return {
            phone: String(user.phone),
            code: user.code,
        };
    }),
    chineseMainland: {
        accessId: config.login.sms.chinese_mainland.access_id,
        accessSecret: config.login.sms.chinese_mainland.access_secret,
        templateCode: config.login.sms.chinese_mainland.template_code,
        signName: config.login.sms.chinese_mainland.sign_name,
    },
    hmt: {
        accessId: config.login.sms.hmt.access_id,
        accessSecret: config.login.sms.hmt.access_secret,
        templateCode: config.login.sms.hmt.template_code,
        signName: config.login.sms.hmt.sign_name,
    },
    global: {
        accessId: config.login.sms.global.access_id,
        accessSecret: config.login.sms.global.access_secret,
        templateCode: config.login.sms.global.template_code,
        signName: config.login.sms.global.sign_name,
    },
};

export const LogConfig = {
    pathname: config.log.pathname,
    filename: config.log.filename,
};

export const Censorship = {
    text: {
        enable: config.censorship.text.enable,
        type: config.censorship.text.type,
        aliCloud: {
            accessID: config.censorship.text.aliCloud.access_id,
            accessSecret: config.censorship.text.aliCloud.access_secret,
            endpoint: config.censorship.text.aliCloud.endpoint,
        },
    },
};

export const Whiteboard = {
    accessKey: config.whiteboard.access_key,
    secretAccessKey: config.whiteboard.secret_access_key,
    convertRegion: config.whiteboard.convert_region,
};

export const Agora = {
    appId: config.agora.app.id,
    appCertificate: config.agora.app.certificate,
};
