import fastify from "fastify";
import { Server } from "./constants/Config";

const app = fastify({
    caseSensitive: true,
});

app.listen(
    {
        port: Server.port,
        host: "0.0.0.0",
    },
    function (err, address) {
        if (err) {
            process.exit(1);
        }
        console.log(`服务器启动成功，${address}`);
    },
);
