import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const configDirPath =
    process.env.IS_TEST === "yes"
        ? path.join(__dirname, "..", "..", "config")
        : path.join(__dirname, "..", "config");

const env = process.env.IS_TEST === "yes" ? "test" : process.env.NODE_ENV;

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
    jwt: {
        secret: string;
        algorithms: string;
    };
    log: {
        pathname: string;
        filename: string;
    };
    login: {
        wechat: {
            web: {
                enable: boolean;
                app_id: string;
                app_secret: string;
            };
        };
        github: {
            enable: boolean;
            client_id: string;
            client_secret: string;
        };
        qq: {
            enable: boolean;
            client_id: string;
            client_secret: string;
        };
        sms: {
            enable: boolean;
            test_users: Array<{
                phone: string;
                code: number;
            }>;
            chinese_mainland: SMSConfig;
            hmt: SMSConfig;
            global: SMSConfig;
        };
    };
    censorship: {
        text: {
            enable: boolean;
            type: string;
            aliCloud: {
                access_id: string;
                access_secret: string;
                endpoint: string;
            };
        };
    };
    whiteboard: {
        access_key: string;
        secret_access_key: string;
        convert_region: "cn-hz" | "us-sv" | "sg" | "in-mum" | "gb-lon";
    };
    agora: {
        app: {
            id: string;
            certificate: string;
        };
    };
};

interface SMSConfig {
    access_id: string;
    access_secret: string;
    template_code: string;
    sign_name: string;
}
