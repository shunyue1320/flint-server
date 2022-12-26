import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest } from "fastify";
import { Logger, createLoggerAPI, parseError } from "../../logger";
import { LoggerAPI } from "../../logger/LogConext";
import { createDecoder } from "fast-jwt";

export const kAPILogger = Symbol("api-logger");

const jwtDecoder = createDecoder({
    complete: true,
});

const plugin = (instance: FastifyInstance, _opts: any, done: () => void): void => {
    instance.decorateRequest(kAPILogger, null);

    instance.addHook("onRequest", (request, _reply, done) => {
        const log = apiLogger(request);
        log.debug("接收请求");
        request[kAPILogger] = log;

        done();
    });

    instance.addHook("onResponse", (request, reply, done) => {
        const log = request[kAPILogger] as Logger<LoggerAPI> | undefined;
        if (log) {
            const durationMS = reply.getResponseTime();
            log.debug("请求执行时间", {
                durationMS,
            });
        }

        done();
    });

    instance.addHook("onError", (request, _reply, error, done) => {
        const log = request[kAPILogger] as Logger<LoggerAPI> | undefined;
        if (log) {
            if (error.validation) {
                log.debug("验证错误", parseError(error));
            } else {
                log.error("请求错误", parseError(error));
            }
        }

        done();
    });

    done();
};

export const fastifyAPILogger = fp(plugin);

const apiLogger = (request: FastifyRequest): Logger<LoggerAPI> => {
    const user = ((): any => {
        if (request.headers && request.headers["authorization"]) {
            if (request.headers["authorization"].startsWith("Bearer ")) {
                // 7 => "Bearer "
                return jwtDecoder(request.headers["authorization"].slice(7)).payload;
            }
        }
        return {};
    })();

    return createLoggerAPI<RecursionObject<string | number | boolean>>({
        requestPath: request.routerPath,
        routerMethod: request.routerMethod,
        user: user
            ? {
                  userUUID: user?.userUUID,
                  loginSource: user?.loginSource,
                  iat: user?.iat,
                  exp: user?.exp,
              }
            : undefined,
        params: {
            ...(request.params as any),
        },
        body: {
            ...(request.body as any),
        },
        query: {
            ...(request.query as any),
        },
        headers: {
            ...(request.headers as any),
        },
    }) as Logger<LoggerAPI>;
};
