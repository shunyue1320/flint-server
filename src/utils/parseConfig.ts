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

export const conifg = yaml.load(yamlContent) as Config;

type Config = {
    server: {
        port: number;
    };
};
