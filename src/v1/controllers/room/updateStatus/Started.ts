import { Type } from "@sinclair/typebox";
import { Status } from "../../../../constants/Project";
import { ErrorCode } from "../../../../error/ErrorCode";
import { RoomStatus } from "../../../../model/room/Constants";
import { FastifyRequestTypebox } from "../../../../types/Server";
import { RoomDAO } from "../../../dao";

export const updateStatusStartedSchema = {
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

export const updateStatusStarted = async (
    req: FastifyRequestTypebox<typeof updateStatusStartedSchema>,
) => {
    const userUUID = req.userUUID;
    const { roomUUID } = req.body;

    const roomInfo = await RoomDAO.findOne(
        req.DBTransaction,
        ["room_status", "owner_uuid", "periodic_uuid", "begin_time"],
        {
            room_uuid: roomUUID,
            owner_uuid: userUUID,
        },
    );

    if (roomInfo === undefined) {
        return {
            status: Status.Failed,
            code: ErrorCode.RoomNotFound,
        };
    }

    if (roomInfo.room_status === RoomStatus.Started) {
        return {
            status: Status.Success,
            data: {},
        };
    }

    const commands: Promise<unknown>[] = [];
    const beginTime = roomInfo.room_status === RoomStatus.Paused ? roomInfo.begin_time : new Date();
    commands.push(
        RoomDAO.update(
            req.DBTransaction,
            {
                // 将状态改成开始并修改开始时间
                room_status: RoomStatus.Started,
                begin_time: beginTime,
            },
            {
                room_uuid: roomUUID,
            },
        ),
    );

    // 周期房间判断
    // if (roomInfo.periodic_uuid !== "") {

    // }
    await Promise.all(commands);

    return {
        status: Status.Success,
        data: {},
    };
};
