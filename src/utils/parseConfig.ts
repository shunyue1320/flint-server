import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const env = process.env.NODE_ENV;
const configDirPath = path.join(__dirname, "..", "config");

const configPath = (() => {
    const flinenames = [`${env}.local.yaml`, `${env}.yaml`];
    for (const filename of flinenames) {
        const fullPath = path.join(configDirPath, filename);
        if (fs.existsSync(fullPath)) {
            return fullPath;
        }
    }
    throw new Error("找不到配置文件");
})();

const yamlContent = fs.readFileSync(configPath, "utf8");

export const config = yaml.load(yamlContent) as Config;

type Config = {
    server: {
        port: number;
        env: string;
    };
    mysql: {
        host: string;
        port: number;
        username: string;
        password: string;
        db: string;
    };
    redis: {
        host: string;
        port: number;
        username: string | null;
        password: string;
        db: number;
        queueDB: number;
    };
    log: {
        pathname: string;
        filename: string;
    };
    login: {
        sms: {
            test_users: Array<{
                phone: string;
                code: number;
            }>;
            chinese_mainland: SMSConfig;
            hmt: SMSConfig;
            global: SMSConfig;
        };
    };
};

interface SMSConfig {
    access_id: string;
    access_secret: string;
    template_code: string;
    sign_name: string;
}
