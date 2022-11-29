import { Region } from "../../../../constants/Project";
import { RoomType } from "../../../../model/room/Constants";

export type ResponseType = {
    roomType: RoomType;
    roomUUID: string;
    owerUUID: string;
    whiteboardRoomToken: string;
    whiteboardRoomUUID: string;
    rtcUID: number;
    rtcToken: string;
    rtcShareScreen: {
        uid: 10;
        token: string;
    };
    rtmToken: string;
    region: Region;
    showGuide: boolean;
};
