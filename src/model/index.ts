import { UserModel } from "./user/User";
import { UserPhoneModel } from "./user/Phone";
import { UserWeChatModel } from "./user/WeChat";
import { RoomModel } from "./room/Room";
import { RoomUserModel } from "./room/RoomUser";
import { RoomRecordModel } from "./room/RoomRecord";

export type Model =
    | UserModel
    | UserPhoneModel
    | UserWeChatModel
    | RoomModel
    | RoomUserModel
    | RoomRecordModel;
