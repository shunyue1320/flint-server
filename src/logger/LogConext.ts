import { Method } from "axios";

export type LoggerError = {
    errorString: string;
    errorMessage: string;
    errorStack: string;
    errorAxios?: {
        status?: number;
        statusText?: string;
        url?: string;
        method?: Method;
        data?: string;
        headers?: string;
    };
    errorQuery?: {
        code?: string;
        sqlMessage?: string;
        message?: string;
        sqlState?: string;
        query?: string;
    };
};

export type LoggerBase = LoggerError & {
    hostname: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type LoggerServer = LoggerBase & {};
