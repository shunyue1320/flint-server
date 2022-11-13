import jwt from "@fastify/jwt";
import { Algorithm } from "fast-jwt";
import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JWT, Server } from "../../constants/Config";
import { loggerServer, parseError } from "../../logger";
import { Status } from "../../constants/Project";
import { ErrorCode } from "../../error/ErrorCode";

const plugin = async (instance: FastifyInstance, _opts: any): Promise<void> => {
    await instance.register(jwt, {
        secret: JWT.secret,
        sign: {
            algorithm: JWT.algorithms as Algorithm,
            iss: Server.name,
            expiresIn: "29 days", // token 过期时间
        },
    });

    // 当前取 req.authenticate 时会调用下面的回调方法验证jwt
    instance.decorate(
        "authenticate",
        async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
            try {
                await request.jwtVerify();
            } catch (err) {
                // 记录日志
                loggerServer.warn("jwt验证失败", parseError(err));
                void reply.send({
                    status: Status.Failed,
                    code: ErrorCode.JWTSignFailed,
                });

                return;
            }
        },
    );
};

export const fastifyAuthenticate = fp(plugin);
