import { Type } from "@sinclair/typebox";
import { Region, Status } from "../../../../constants/Project";
import { ErrorCode } from "../../../../error/ErrorCode";
import { RoomStatus, RoomType } from "../../../../model/room/Constants";
import { FastifyRequestTypebox, Response } from "../../../../types/Server";
import { RoomDAO, RoomRecordDAO, RoomUserDAO, userDAO } from "../../../dao";
import { getInviteCode } from "./Utils";

export const ordinaryInfoRoomSchema = {
    body: Type.Object(
        {
            roomUUID: Type.String({
                format: "uuid-v4",
            }),
        },
        {
            additionalProperties: false,
        },
    ),
};

export const ordinaryInfoRoom = async (
    req: FastifyRequestTypebox<typeof ordinaryInfoRoomSchema>,
): Promise<Response<ResponseType>> => {
    const userUUID = req.userUUID;
    const { roomUUID } = req.body;

    const roomUserInfo = await RoomUserDAO.findOne(req.DBTransaction, ["id"], {
        user_uuid: userUUID,
        room_uuid: roomUUID,
    });

    if (roomUserInfo === undefined) {
        return {
            status: Status.Failed,
            code: ErrorCode.RoomNotFound,
        };
    }

    const roomInfo = await RoomDAO.findOne(
        req.DBTransaction,
        [
            "title",
            "begin_time",
            "end_time",
            "room_type",
            "room_status",
            "owner_uuid",
            "region",
            "periodic_uuid",
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

    const {
        title,
        begin_time,
        end_time,
        room_type,
        room_status,
        owner_uuid,
        region,
        periodic_uuid: periodicUUID,
    } = roomInfo;

    const userInfo = await userDAO.findOne(req.DBTransaction, ["user_name"], {
        user_uuid: owner_uuid,
    });
    if (userInfo === undefined) {
        return {
            status: Status.Failed,
            code: ErrorCode.UserNotFound,
        };
    }

    const recordInfo = await RoomRecordDAO.findOne(req.DBTransaction, ["id"], {
        room_uuid: roomUUID,
    });

    return {
        status: Status.Success,
        data: {
            roomInfo: {
                title,
                beginTime: begin_time.valueOf(),
                endTime: end_time.valueOf(),
                roomType: room_type,
                roomStatus: room_status,
                ownerUUID: owner_uuid,
                ownerUserName: userInfo.user_name,
                ownerName: userInfo.user_name,
                hasRecord: !!recordInfo,
                region,
                inviteCode: await getInviteCode(periodicUUID || roomUUID),
            },
        },
    };
};

interface ResponseType {
    roomInfo: {
        title: string;
        beginTime: number;
        endTime: number;
        roomType: RoomType;
        roomStatus: RoomStatus;
        ownerUUID: string;
        ownerUserName: string;
        ownerName: string;
        hasRecord: boolean;
        region: Region;
        inviteCode: string;
    };
}
