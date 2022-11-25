import { Type } from "@sinclair/typebox";
import { EntityManager, SelectQueryBuilder } from "typeorm";
import { Region, Status } from "../../../../constants/Project";
import { ListType, RoomType, RoomStatus } from "../../../../model/room/Constants";
import { RoomModel } from "../../../../model/room/Room";
import { RoomRecordModel } from "../../../../model/room/RoomRecord";
import { RoomUserModel } from "../../../../model/room/RoomUser";
import { UserModel } from "../../../../model/user/User";
import RedisService from "../../../../thirdPartyService/RedisService";
import { FastifyRequestTypebox, Response } from "../../../../types/Server";
import { RedisKey } from "../../../../utils/Redis";

export const roomListSchema = {
    querystring: Type.Object(
        {
            page: Type.Integer({
                maximum: 50,
                minimum: 1,
            }),
        },
        {
            additionalProperties: false,
        },
    ),
    params: Type.Object(
        {
            type: Type.String({
                enum: [ListType.All, ListType.Today, ListType.Periodic, ListType.History],
            }),
        },
        {
            additionalProperties: false,
        },
    ),
};

export const roomList = async (
    req: FastifyRequestTypebox<typeof roomListSchema>,
): Promise<Response<ResponseType>> => {
    const rooms = await queryRoomsByType(
        req.DBTransaction,
        req.params.type,
        req.query.page,
        req.userUUID,
    );

    // 查询到的房间列表
    const roomUUIDs = rooms.map(roomInfo => {
        return roomInfo.periodicUUID || roomInfo.roomUUID;
    });

    // 去 redis 缓存里面读邀请码
    const inviteCodes = await RedisService.mget(roomUUIDs.map(RedisKey.roomInviteCodeReverse));

    const resp: ResponseType = rooms.map((room, index) => {
        return {
            roomUUID: room.roomUUID,
            periodicUUID: room.periodicUUID || null,
            ownerUUID: room.ownerUUID,
            ownerAvatarURL: room.ownerAvatarURL,
            roomType: room.roomType,
            title: room.title,
            beginTime: room.beginTime.valueOf(),
            endTime: room.endTime.valueOf(),
            roomStatus: room.roomStatus,
            ownerName: room.ownerName,
            region: room.region,
            hasRecord: !!room.hasRecord,
            inviteCode: inviteCodes[index] || room.periodicUUID || room.roomUUID,
        };
    });

    return {
        status: Status.Success,
        data: resp,
    };
};

const queryRoomsByType = async (
    DBTransaction: EntityManager,
    type: string,
    page: number,
    userUUID: string,
): Promise<ResponseType> => {
    let queryBuilder = basisQuery(DBTransaction, type, page, userUUID);

    switch (type) {
        case ListType.All: {
            // 查询状态不等于 "Stopped" 的所有房间
            queryBuilder = queryBuilder.andWhere("r.room_status <> :notRoomStatus", {
                notRoomStatus: RoomStatus.Stopped,
            });
            break;
        }
        case ListType.Today: {
            // 查询状态不等于 "Stopped" 的所有房间
            queryBuilder = queryBuilder
                .andWhere("r.begin_time = CURDATE()")
                .andWhere("r.room_status <> :notRoomStatus", {
                    notRoomStatus: RoomStatus.Stopped,
                });
            break;
        }
        case ListType.Periodic: {
            // 查询状态不等于 "Stopped" 的所有房间
            queryBuilder = queryBuilder
                .andWhere("r.room_status <> :notRoomStatus", {
                    notRoomStatus: RoomStatus.Stopped,
                })
                .andWhere("length(r.periodic_uuid) <> 0");
            break;
        }
        case ListType.History: {
            queryBuilder = queryBuilder
                .leftJoin(
                    qb => {
                        // 房间记录表里面找
                        return qb
                            .subQuery()
                            .addSelect("temp_rr.room_uuid", "room_uuid")
                            .addSelect("temp_rr.is_delete", "is_delete")
                            .from(RoomRecordModel, "temp_rr")
                            .addGroupBy("room_uuid")
                            .addGroupBy("is_delete");
                    },
                    "rr",
                    "rr.room_uuid = r.room_uuid AND rr.is_delete = false",
                )
                .addSelect("rr.room_uuid", "hasRecord")
                .andWhere("r.room_status = :roomStatus", {
                    roomStatus: RoomStatus.Stopped,
                });
            break;
        }
    }

    return (await queryBuilder.getRawMany()) as ResponseType;
};

const basisQuery = (
    DBTransaction: EntityManager,
    type: string,
    page: number,
    userUUID: string,
): SelectQueryBuilder<RoomUserModel> => {
    return DBTransaction.createQueryBuilder(RoomUserModel, "ru")
        .innerJoin(RoomModel, "r", "ru.room_uuid = r.room_uuid")
        .innerJoin(UserModel, "u", "u.user_uuid = r.owner_uuid")
        .addSelect("r.title", "title")
        .addSelect("r.room_uuid", "roomUUID")
        .addSelect("r.periodic_uuid", "periodicUUID")
        .addSelect("r.room_type", "roomType")
        .addSelect("r.begin_time", "beginTime")
        .addSelect("r.end_time", "endTime")
        .addSelect("r.owner_uuid", "ownerUUID")
        .addSelect("r.room_status", "roomStatus")
        .addSelect("r.region", "region")
        .addSelect("u.user_name", "ownerName")
        .addSelect("u.avatar_url", "ownerAvatarURL")
        .andWhere("ru.user_uuid = :userUUID", {
            userUUID,
        })
        .andWhere("ru.is_delete = false")
        .andWhere("r.is_delete = false")
        .andWhere("u.is_delete = false")
        .orderBy({
            "r.begin_time": type === ListType.History ? "DESC" : "ASC",
        })
        .offset((page - 1) * 50)
        .limit(50);
};

export type ResponseType = Array<{
    roomUUID: string;
    periodicUUID: string | null;
    roomType: RoomType;
    ownerUUID: string;
    ownerAvatarURL: string;
    title: string;
    beginTime: number;
    endTime: number;
    roomStatus: RoomStatus;
    ownerName: string;
    hasRecord?: boolean;
    region: Region;
    inviteCode: string;
}>;
