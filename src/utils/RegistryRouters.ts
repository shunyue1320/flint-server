import { FastifyReply } from "fastify";
import { Status } from "../constants/Project";
import { FastifyInstance, FastifyRequestTypebox, Response } from "../types/Server";
import { ErrorCode } from "../ErrorCode";
import { FError } from "../error/ControllerError";

const registerRouters =
    (version: `v${number}`) =>
    (fastifyServer: FastifyInstance, controllers: Array<(server: Server) => void>) => {
        const routerHandle = (method: "get" | "post"): Router => {
            return <S>(
                path: string,
                handler: (req: FastifyRequestTypebox<S>, reply: FastifyReply) => Promise<any>,
                config: {
                    auth?: boolean;
                    schema: S;
                    autoHandle?: boolean;
                    enable?: boolean;
                },
            ) => {
                const autoHandle = config.autoHandle === undefined || config.autoHandle;
                const auth = config.auth === undefined || config.auth;
                const enable = config.enable === undefined || config.enable;

                // 是否使用该路由
                if (!enable) {
                    return;
                }

                fastifyServer[method](
                    `/${version}/${path}`,
                    {
                        // 在校验之前，是否需要登录权限校验
                        // preValidation: auth ? [(fastifyServer as any).authen] : undefined,
                        schema: config.schema,
                    },
                    async (req, reply: FastifyReply) => {
                        if (!autoHandle) {
                            req.notAutoHandle = true;
                        }

                        let resp: Response | null = null;

                        const request = Object.assign(req, {
                            userUUID: req?.user?.userUUID,
                            loginSource: req?.user?.loginSource,
                            // DBTransaction: req.queryRunner.manager,
                        });

                        try {
                            const result = await handler(request, reply);
                            if (autoHandle) {
                                resp = result as Response;
                            }
                        } catch (error) {
                            if (autoHandle) {
                                resp = errorToResp(error as Error);
                            } else {
                                throw error;
                            }
                        }

                        if (resp) {
                            await reply.send(resp);
                        }
                        return reply;
                    },
                );
            };
        };

        const server = {
            get: routerHandle("get"),
            post: routerHandle("post"),
        };

        controllers.forEach(controller => {
            controller(server);
        });
    };

const errorToResp = (error: Error): Response => {
    if (error instanceof FError) {
        return {
            status: error.status,
            code: error.errorCode,
        };
    } else {
        return {
            status: Status.Failed,
            code: ErrorCode.CurrentProcessFailed,
        };
    }
};

export const registerRoutersV1 = registerRouters("v1");
export const registerRoutersV2 = registerRouters("v2");

interface R<O> {
    <S>(
        path: string,
        hander: (
            req: FastifyRequestTypebox<S>,
            reply: FastifyReply,
        ) => Promise<O extends false ? void : Response>,
        config: {
            auth?: boolean;
            schema: S;
            autoHandle?: O;
        },
    );
}

interface Router extends R<true>, R<false> {}

export interface Server {
    get: Router;
    post: Router;
}
