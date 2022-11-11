import path from "path";
import filenamify, { filenamifyPath } from "filenamify";
import { appendFileSync, ensureDirSync, existsSync } from "fs-extra";
import { LoggerContext, LoggerFormat } from "../Logger";
import { LoggerAbstractPlugin } from "./LoggerAbstractPlugin";
import { envVariable } from "../../utils/EnvVariable";

export class LoggerPluginFile<C extends LoggerContext> extends LoggerAbstractPlugin<C> {
    public constructor(private readonly pathname: string, private readonly filename: string) {
        super();
    }
    public output(log: LoggerFormat<C>): void {
        appendFileSync(this.logFilePath, `${JSON.stringify(log)}\n`);
    }
    public get logFilePath(): string {
        const pathname = filenamifyPath(envVariable.parse(this.pathname), {
            replacement: "-",
        });

        const filename = filenamify(envVariable.parse(this.filename), {
            replacement: "-",
        });

        const filePath = `${path.join(pathname, filename)}.log`;

        if (!existsSync(pathname)) {
            ensureDirSync(pathname);
        }

        return filePath;
    }
}
