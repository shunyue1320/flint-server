import packages from "../../package.json";
import { config } from "../utils/ParseConfig";

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

export const PhoneSMS = {
    chineseMainland: {
        accessId: config.login.sms.chinese_mainland.access_id,
        accessSecret: config.login.sms.chinese_mainland.access_secret,
        templateCode: config.login.sms.chinese_mainland.template_code,
        signName: config.login.sms.chinese_mainland.sign_name,
    },
};
