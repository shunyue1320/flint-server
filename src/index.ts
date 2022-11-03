import fastify from "fastify";
import { Server } from "./constants/Config";
import { orm } from "./thirdPartyService/TypeORMService";
import { registerRoutersV1 } from "./utils/RegistryRouters";
import { v1Routers } from "./v1/controllers/routes";

const app = fastify({
    caseSensitive: true,
});

app.get("/health-check", async (_req, reply) => {
    return reply.code(200).send();
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
                console.log(`服务器启动失败`);
                process.exit(1);
            }
            console.log(`服务器启动成功，${address}`);
        },
    );
});
