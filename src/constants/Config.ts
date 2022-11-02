import packages from "../../package.json";
import { config } from "../utils/ParseConfig";

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
