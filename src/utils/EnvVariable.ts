import os from "os";
import path from "path";
import { format } from "date-fns/fp";
import { EnvVariableParse } from "./EnvVariableParse";

export const variables = {
    HOSTNAME: os.hostname(),
    PROJECT_DIR: path.resolve(__dirname, ".."),
    DAY_DATE: (): string => format("yyyy-MM-dd")(Date.now()),
};

export const envVariable = new EnvVariableParse(variables);
