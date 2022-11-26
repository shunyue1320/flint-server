import { EntityManager } from "typeorm";
import { addHours, toDate } from "date-fns/fp";
import { Region } from "../../../constants/Project";
import { RoomStatus, RoomType } from "../../../model/room/Constants";
import { RoomDAO } from "../../dao";
import { whiteboardCreateRoom } from "../../utils/request/whiteboard/WhiteboardRequest";

export class RoomService {
    constructor(
        private readonly DBTransaction: EntityManager,
        private readonly roomUUID: string,
        private readonly userUUID: string,
    ) {}

    public async create(data: {
        title: string;
        type: RoomType;
        region: Region;
        beginTime?: number | Date;
        endTime?: number | Date;
    }): Promise<void> {
        const { title, type, region, endTime } = data;
        const beginTime = data.beginTime || Date.now();

        await RoomDAO.insert(this.DBTransaction, {
            periodic_uuid: "",
            owner_uuid: this.userUUID,
            title,
            room_type: type,
            room_status: RoomStatus.Idle,
            room_uuid: this.roomUUID,
            whiteboard_room_uuid: await whiteboardCreateRoom(region),
            begin_time: toDate(beginTime),
            end_time: endTime ? toDate(endTime) : addHours(1, beginTime),
            region,
        });
    }
}
