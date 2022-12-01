import { EntityManager } from "typeorm";
import { RoomDAO } from "../../../dao";

export const showGuide = async (
    DBTransaction: EntityManager,
    userUUID: string,
    roomUUID: string,
): Promise<boolean> => {
    const rooms = await RoomDAO.find(
        DBTransaction,
        ["room_uuid"],
        {
            owner_uuid: userUUID,
        },
        {
            limit: 2,
        },
    );

    const isFirstRoom = rooms.length === 1 && rooms[0].room_uuid === roomUUID;
    if (!isFirstRoom) {
        return false;
    }

    return false;
};
