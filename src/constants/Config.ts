import packages from "../../package.json";
import { conifg } from "../utils/ParseConfig";

export const Server = {
    port: conifg.server.port,
    name: "flint-server",
    version: packages.version,
};
