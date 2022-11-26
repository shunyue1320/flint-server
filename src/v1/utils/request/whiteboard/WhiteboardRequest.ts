import { ax } from "../../Axios";
import { Region } from "../../../../constants/Project";
import { createWhiteboardSDKToken } from "../../../../utils/NetlessToken";

/**
 * 白板创建房间 api
 * @param {Region} region - 白板房间区域
 * @param {number} limit - (default: 0 = no limit)
 * @return {string} 白板房间的 uuid，而不是房间模型的 room_uid
 */
export const whiteboardCreateRoom = async (region: Region, limit = 0): Promise<string> => {
    const {
        data: { uuid },
    } = await ax.post<Room>(
        // 文档：https://docs.agora.io/cn/whiteboard/whiteboard_room_management
        "https://api.netless.link/v5/rooms",
        {
            isRecord: true,
            limit,
        },
        {
            headers: {
                token: createWhiteboardSDKToken(),
                region,
            },
        },
    );

    return uuid;
};

interface Room {
    uuid: string;
    name: string;
    teamUUID: string;
    isRecord: boolean;
    isBan: boolean;
    limit: number;
    createdAt: string;
}
