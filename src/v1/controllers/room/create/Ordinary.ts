import { Type } from "@sinclair/typebox";
import { v4 } from "uuid";
import { Region, Status } from "../../../../constants/Project";
import { FError } from "../../../../error/ControllerError";
import { ErrorCode } from "../../../../error/ErrorCode";
import { RoomType } from "../../../../model/room/Constants";
import { FastifyRequestTypebox, Response } from "../../../../types/Server";
import { RoomService } from "../../../services/room/Room";
import { RoomUserService } from "../../../services/room/RoomUser";
import { aliGreenText } from "../../../utils/AliGreen";
import {
    beginTimeLessEndTime,
    timeExceedRedundancyOneMinute,
    timeIntervalLessThanFifteenMinute,
} from "../utils/checkTime";
import { generateRoomInviteCode } from "./Utils";

export const createOrdinarySchema = {
    body: Type.Object({
        title: Type.String({
            maxLength: 50,
        }),
        type: Type.String({
            enum: [RoomType.OneToOne, RoomType.SmallClass, RoomType.BigClass],
        }),
        beginTime: Type.Optional(
            Type.Integer({
                format: "unix-timestamp",
            }),
        ),
        endTime: Type.Optional(
            Type.Integer({
                format: "unix-timestamp",
            }),
        ),
        region: Type.String({
            enum: [Region.CN_HZ, Region.US_SV, Region.SG, Region.IN_MUM, Region.GB_LON],
        }),
    }),
};

export const createOrdinary = async (
    req: FastifyRequestTypebox<typeof createOrdinarySchema>,
): Promise<Response<ResponseType>> => {
    await checkParams(req);

    const roomUUID = v4();
    const svc = {
        room: new RoomService(req.DBTransaction, roomUUID, req.userUUID),
        roomUser: new RoomUserService(req.DBTransaction, roomUUID, req.userUUID),
    };

    await Promise.all([
        // 给 rooms 表插入一条数据
        svc.room.create({
            title: req.body.title,
            type: req.body.type as RoomType,
            region: req.body.region as Region,
            beginTime: req.body.beginTime,
            endTime: req.body.endTime,
        }),
        // 给 room_users 表插入一条数据
        svc.roomUser.create(),
    ]);

    return {
        status: Status.Success,
        data: {
            roomUUID: roomUUID,
            // 分享码对应的是房间uuid
            inviteCode: await generateRoomInviteCode(roomUUID),
        },
    };
};

/** 检查参数是否合格 */
const checkParams = async (
    req: FastifyRequestTypebox<typeof createOrdinarySchema>,
): Promise<void> => {
    const { beginTime, endTime, title } = req.body;

    if (beginTime && timeExceedRedundancyOneMinute(beginTime)) {
        throw new FError(ErrorCode.ParamsCheckFailed);
    }

    if (endTime) {
        // 有结束时间就一定要有开始时间
        if (!beginTime) {
            throw new FError(ErrorCode.ParamsCheckFailed);
        }

        // 开始时间必须小于结束时间
        if (beginTimeLessEndTime(beginTime, endTime)) {
            throw new FError(ErrorCode.ParamsCheckFailed);
        }

        // 时间间隔必须大于15分钟
        if (timeIntervalLessThanFifteenMinute(beginTime, endTime)) {
            throw new FError(ErrorCode.NonCompliant);
        }
    }

    // 内容合规校验
    if (await aliGreenText.textNonCompliant(title)) {
        throw new FError(ErrorCode.NonCompliant);
    }
};

interface ResponseType {
    inviteCode: string;
    roomUUID: string;
}
