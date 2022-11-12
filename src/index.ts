import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { ajvSelfPlugin } from "./plugins/Ajv";
import { Server } from "./constants/Config";
import { orm } from "./thirdPartyService/TypeORMService";
import { registerRoutersV1 } from "./utils/RegistryRouters";
import { v1Routers } from "./v1/controllers/routes";
import { Status } from "./constants/Project";
import { ErrorCode } from "./error/ErrorCode";
import { loggerServer, parseError } from "./logger";

const app = fastify({
    caseSensitive: true,
    // ajv配置，ajv是一个非常流行的 JSON Schema 验证工具
    ajv: {
        plugins: [ajvSelfPlugin],
    },
}).withTypeProvider<TypeBoxTypeProvider>();

app.setErrorHandler((err, request, reply) => {
    if (err.validation) {
        void reply.status(200).send({
            status: Status.Failed,
            code: ErrorCode.ParamsCheckFailed,
        });

        return;
    }

    // 记录级别为 error 的日志
    loggerServer.error("请求意外中断", parseError(err));

    if (!request.notAutoHandle) {
        void reply.status(200).send({
            status: Status.Failed,
            code: ErrorCode.CurrentProcessFailed,
        });
        return;
    }
});

app.get("/health-check", async (_req, reply) => {
    return reply.code(200).send("服务器已启动！");
});

// orm: 连接好数据库后开启后端路由服务
void orm().then(() => {
    // 挂载 v1 路由接口
    registerRoutersV1(app, v1Routers);

    app.listen(
        {
            port: Server.port,
            host: "0.0.0.0",
        },
        (err, address) => {
            if (err) {
                loggerServer.error("服务器启动失败", parseError(err));
                process.exit(1);
            }
            loggerServer.info(`服务器启动成功，${address}`);
        },
    );
});
