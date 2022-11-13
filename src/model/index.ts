import { UserModel } from "./user/User";
import { UserPhoneModel } from "./user/Phone";
import { UserWeChatModel } from "./user/WeChat";

export type Model = UserModel | UserPhoneModel | UserWeChatModel;
