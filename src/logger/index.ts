import os from "os";
import { Logger } from "./Logger";
import { LoggerPluginFile } from "./plugins/LoggerPluginFile";
import { LoggerPluginTerminal } from "./plugins/LoggerPluginTerminal";
import { LogConfig } from "../constants/Config";
import { LoggerServer } from "./LogConext";

export { parseError } from "./ParseError";

const baseContext = {
    hostname: os.hostname(),
};

const loggerPlugins = [
    new LoggerPluginTerminal(),
    // 日志存储路径
    new LoggerPluginFile(LogConfig.pathname, LogConfig.filename),
];

export const loggerServer = new Logger<LoggerServer>(
    "server",
    {
        ...baseContext,
    },
    loggerPlugins,
);
