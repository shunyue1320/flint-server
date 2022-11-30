import cryptoRandomString from "crypto-random-string";
import { EntityManager } from "typeorm";
import { AGORA_SHARE_SCREEN_UID } from "../../../../constants/Agora";
import { Status } from "../../../../constants/Project";
import { ErrorCode } from "../../../../error/ErrorCode";
import { RoomStatus } from "../../../../model/room/Constants";
import { createWhiteboardRoomToken } from "../../../../utils/NetlessToken";
import { RoomDAO, RoomUserDAO } from "../../../dao";
import { getRTCToken, getRTMToken } from "../../../utils/AgoraToken";

export const joinOrdinary = async (
    DBTransaction: EntityManager,
    roomUUID: string,
    userUUID: string,
) => {
    // 查找 rooms 表返回房间详情
    const roomInfo = await RoomDAO.findOne(
        DBTransaction,
        [
            "room_status",
            "whiteboard_room_uuid",
            "periodic_uuid",
            "room_type",
            "owner_uuid",
            "region",
        ],
        {
            room_uuid: roomUUID,
        },
    );

    if (roomInfo === undefined) {
        return {
            status: Status.Failed,
            code: ErrorCode.RoomNotFound,
        };
    }

    if (roomInfo.room_status === RoomStatus.Stopped) {
        return {
            status: Status.Failed,
            code: ErrorCode.RoomIsEnded,
        };
    }

    const { whiteboard_room_uuid: whiteboardRoomUUID } = roomInfo;
    let rtcUID: string;

    // 查找 room_users 表返回 rtc_uid
    const roomUserInfo = await RoomUserDAO.findOne(DBTransaction, ["rtc_uid"], {
        room_uuid: roomUUID,
        user_uuid: userUUID,
    });

    if (roomUserInfo !== undefined) {
        rtcUID = roomUserInfo.rtc_uid;
    } else {
        // 不存在 rtc_uid 就生成一个
        rtcUID = cryptoRandomString({ length: 6, type: "numeric" });

        await RoomUserDAO.insert(
            DBTransaction,
            {
                room_uuid: roomUUID,
                user_uuid: userUUID,
                rtc_uid: rtcUID,
                is_delete: false,
            },
            {
                orUpdate: ["is_delete"],
            },
        );
    }

    return {
        status: Status.Success,
        data: {
            roomType: roomInfo.room_type,
            roomUUID: roomUUID,
            ownerUUID: roomInfo.owner_uuid,
            whiteboardRoomToken: createWhiteboardRoomToken(whiteboardRoomUUID),
            whiteboardRoomUUID: whiteboardRoomUUID,
            rtcUID: Number(rtcUID),
            rtcToken: await getRTCToken(roomUUID, Number(rtcUID)),
            rtcShareScreen: {
                uid: AGORA_SHARE_SCREEN_UID,
                token: await getRTCToken(roomUUID, AGORA_SHARE_SCREEN_UID),
            },
            rtmToken: await getRTMToken(userUUID),
            region: roomInfo.region,
            showGuide: roomInfo.owner_uuid === userUUID && (await showGuide(userUUID, roomUUID)),
        },
    };
};
