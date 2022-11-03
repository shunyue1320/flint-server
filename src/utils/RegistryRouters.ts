import fastify from "fastify";

const registerRouters = (version: `v${number}`) => (fastifyServer, controllers) => {
    const routerHandle = (method: "get" | "post") => {
        return (path, hander, config) => {
            const autoHandle = config.autoHandle === undefined || config.autoHandle;

            fastifyServer[method](
                `/${version}/${path}`,
                {
                    schema: config.schema,
                },
                async (req, reply) => {
                    let resp: Response | null = null;

                    const request = Object.assign(req, {
                        userUUID: req?.user?.userUUID,
                        loginSource: req?.user?.loginSource,
                        DBTransaction: req.queryRunner.manager,
                    });

                    try {
                        const result = await hander(request, reply);
                        if (autoHandle) {
                            resp = result as Response;
                        }
                    } catch (error) {
                        if (autoHandle) {
                            resp = error as Error;
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
        controllers(server);
    });
};

export const registerRoutersV1 = registerRouters("v1");
export const registerRoutersV2 = registerRouters("v2");
