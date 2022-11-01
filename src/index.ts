import fastify from "fastify";

const app = fastify({
    caseSensitive: true,
});

app.listen({ port: 3000 }, function (err, address) {
    if (err) {
        process.exit(1);
    }
    console.log(`服务器启动成功，${address}`);
});
