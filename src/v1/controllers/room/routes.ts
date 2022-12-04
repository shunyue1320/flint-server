import { Server } from "../../../utils/RegistryRouters";
import { roomList, roomListSchema } from "./list";
import { createOrdinary, createOrdinarySchema } from "../room/create/Ordinary";
import { joinRoom, joinRoomSchema } from "../room/join";
import { ordinaryInfoRoom, ordinaryInfoRoomSchema } from "./info/Ordinary";

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
    // 加入房间
    server.post("room/join", joinRoom, {
        schema: joinRoomSchema,
        auth: true,
    });
    // 普通的房间信息
    server.post("room/info/ordinary", ordinaryInfoRoom, {
        schema: ordinaryInfoRoomSchema,
        auth: true,
    });
};
