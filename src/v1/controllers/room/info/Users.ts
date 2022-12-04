import { Type } from "@sinclair/typebox";
import { Status } from "../../../../constants/Project";
import { ErrorCode } from "../../../../error/ErrorCode";
import { RoomUserModel } from "../../../../model/room/RoomUser";
import { UserModel } from "../../../../model/user/User";
import { FastifyRequestTypebox, Response } from "../../../../types/Server";
import { RoomUserDAO } from "../../../dao";

export const userInfoRoomSchema = {
    body: Type.Object(
        {
            roomUUID: Type.String({
                format: "uuid-v4",
            }),
            usersUUID: Type.Array(
                Type.String({
                    format: "uuid-v4",
                }),
                {
                    minItems: 1,
                    maxItems: 50, // 一间最多教室 50 人
                },
            ),
        },
        {
            additionalProperties: false,
        },
    ),
};

export const userInfoRoom = async (
    req: FastifyRequestTypebox<typeof userInfoRoomSchema>,
): Promise<Response<ResponseType>> => {
    const userUUID = req.userUUID;
    const { roomUUID, usersUUID } = req.body;

    // 验证该用户是否在房间内
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

    const roomUsersInfoBasic = req.DBTransaction.createQueryBuilder(RoomUserModel, "ru")
        // 1. 从 RoomUserModel 表里找到 rtc_uid user_uuid
        // 2. 从对于 UserModel 表里找到 user_name avatar_url
        .addSelect("ru.rtc_uid", "rtc_uid")
        .addSelect("ru.user_uuid", "user_uuid")
        .addSelect("u.user_name", "user_name")
        .addSelect("u.avatar_url", "avatar_url")
        .innerJoin(UserModel, "u", "ru.user_uuid = u.user_uuid")
        .andWhere("room_uuid = :roomUUID", {
            roomUUID,
        })
        .andWhere("ru.is_delete = false")
        .andWhere("u.is_delete = false");

    // 添加查询条件 ru.user_uuid 取值范围在 usersUUID 内
    if (usersUUID) {
        roomUsersInfoBasic.andWhere("ru.user_uuid IN (:...usersUUID)", {
            usersUUID,
        });
    }

    // 返回查询到的所有用户信息
    const roomUsersInfo = await roomUsersInfoBasic.getRawMany<RoomUsersInfo>();
    if (roomUsersInfo.length === 0) {
        return {
            status: Status.Failed,
            code: ErrorCode.UserNotFound,
        };
    }

    // 用户信息数组 roomUsersInfo 转成 mapping
    const result: ResponseType = {};
    for (const { user_name, user_uuid, rtc_uid, avatar_url } of roomUsersInfo) {
        result[user_uuid] = {
            name: user_name,
            rtcUID: Number(rtc_uid),
            avatarURL: avatar_url,
        };
    }

    return {
        status: Status.Success,
        data: result,
    };
};

type ResponseType = {
    [key in string]: {
        name: string;
        rtcUID: number;
        avatarURL: string;
    };
};

type RoomUsersInfo = Pick<RoomUserModel, "rtc_uid" | "user_uuid"> &
    Pick<UserModel, "user_name" | "avatar_url">;
