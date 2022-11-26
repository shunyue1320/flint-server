import { Server } from "../../../utils/RegistryRouters";
import { roomList, roomListSchema } from "./list";
import { createOrdinary, createOrdinarySchema } from "../room/create/Ordinary";

export const roomRouters = (server: Server): void => {
    // 房间列表
    server.post("room/list/:type", roomList, {
        schema: roomListSchema,
        auth: true,
    });
    // 创建房间
    server.post("room/create/ordinary", createOrdinary, {
        schema: createOrdinarySchema,
        auth: true,
    });
};
