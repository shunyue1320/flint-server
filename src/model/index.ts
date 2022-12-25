import { UserModel } from "./user/User";
import { UserPhoneModel } from "./user/Phone";
import { UserWeChatModel } from "./user/WeChat";
import { UserGithubModel } from "./user/Github";
import { UserQQModel } from "./user/QQ";
import { RoomModel } from "./room/Room";
import { RoomUserModel } from "./room/RoomUser";
import { RoomRecordModel } from "./room/RoomRecord";

export type Model =
    | UserModel
    | UserPhoneModel
    | UserWeChatModel
    | UserGithubModel
    | UserQQModel
    | RoomModel
    | RoomUserModel
    | RoomRecordModel;
