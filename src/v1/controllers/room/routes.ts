import { Server } from "../../../utils/RegistryRouters";
import { roomList, roomListSchema } from "./list";

export const roomRouters = (server: Server): void => {
    // 房间列表
    server.post("room/list/:type", roomList, {
        schema: roomListSchema,
        auth: true,
    });
};
