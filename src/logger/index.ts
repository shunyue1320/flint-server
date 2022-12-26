import os from "os";
import { Logger, LoggerContext } from "./Logger";
import { LoggerPluginFile } from "./plugins/LoggerPluginFile";
import { LoggerPluginTerminal } from "./plugins/LoggerPluginTerminal";
import { LogConfig } from "../constants/Config";
import { LoggerAPI, LoggerServer } from "./LogConext";
import { LoggerAbstractPlugin } from "./plugins/LoggerAbstractPlugin";

export { Logger };
export { parseError } from "./ParseError";

const baseContext = {
    hostname: os.hostname(),
};

const loggerPlugins = [
    new LoggerPluginTerminal(),
    // 日志存储路径
    new LoggerPluginFile(LogConfig.pathname, LogConfig.filename),
];

export const createLoggerAPI = <R extends LoggerContext>(
    context: Partial<LoggerAPI & R>,
): Logger<LoggerAPI & R> => {
    return new Logger<LoggerAPI & R>(
        "api",
        {
            ...context,
            ...baseContext,
        },
        loggerPlugins as LoggerAbstractPlugin<LoggerAPI & R>[],
    );
};

export const loggerServer = new Logger<LoggerServer>(
    "server",
    {
        ...baseContext,
    },
    loggerPlugins,
);
