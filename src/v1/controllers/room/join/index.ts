import { Type } from "@sinclair/typebox";
import { FError } from "../../../../error/ControllerError";
import { ErrorCode } from "../../../../error/ErrorCode";
import RedisService from "../../../../thirdPartyService/RedisService";
import { FastifyRequestTypebox, Response } from "../../../../types/Server";
import { RedisKey } from "../../../../utils/Redis";
import { RoomDAO } from "../../../dao";
import { ResponseType } from "./Type";

export const joinRoomSchema = {
    body: Type.Object(
        {
            uuid: Type.String(),
        },
        {
            additionalProperties: false,
        },
    ),
};

export const joinRoom = async (
    req: FastifyRequestTypebox<typeof joinRoomSchema>,
): Promise<Response<ResponseType>> => {
    const { userUUID } = req.userUUID;
    let uuid: string = req.body.uuid;

    if (isInviteCode(uuid)) {
        try {
            // 拿邀请码去 redis 读取房间id(roomUUID)
            const result = await RedisService.get(RedisKey.roomInviteCode(uuid));
            if (result) {
                uuid = result;
            }
        } catch (error) {
            // 错误
        }
        // 从 redis 内获取不到 roomUUID 时
        if (uuid === req.body.uuid) {
            throw new FError(ErrorCode.RoomNotFound);
        }
    }

    // 查找到
    const isOrdinaryRoomUUID = await RoomDAO.findOne(req.DBTransaction, ["id"], {
        room_uuid: uuid,
        periodic_uuid: "",
    });

    if (isOrdinaryRoomUUID) {
        return await joinOrdinary(uuid, userUUID);
    }
};

/** 10位数则为验证码 返回 true */
const isInviteCode = (uuid: string): boolean => {
    return /^\d{10}$/.test(uuid);
};
