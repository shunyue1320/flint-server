import { Column, Entity, Index } from "typeorm";
import { Content } from "../Content";

@Entity({
    name: "user_wechat",
})
export class UserWeChatModel extends Content {
    @Index("user_wechat_user_uuid_uindex", {
        unique: true,
    })
    @Column({
        length: 40,
    })
    user_uuid: string;

    @Column({
        length: 40,
        comment: "wechat nickname",
    })
    user_name: string;

    // open_uuid: 用户在同一个小程序下的唯一表示，即同一个用户在不同的小程序下的openid是不同的
    @Column({
        length: 40,
        comment: "wechat open id",
    })
    open_uuid: string;

    // union_uuid: 是微信号与开放平台APPID加密后得到的用户唯一标识
    @Column({
        length: 40,
        comment: "wechat union id",
    })
    union_uuid: string;

    @Index("user_wechat_is_delete_index")
    @Column({
        default: false,
    })
    is_delete: boolean;
}
