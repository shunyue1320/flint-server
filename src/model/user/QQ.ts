import { Column, Entity, Index } from "typeorm";
import { Content } from "../Content";

@Entity({
    name: "user_qq",
})
export class UserQQModel extends Content {
    @Index("user_qq_user_uuid_uindex", {
        unique: true,
    })
    @Column({
        length: 40,
    })
    user_uuid: string;

    @Column({
        length: 40,
        comment: "qq nickname",
    })
    user_name: string;

    // openid: QQ用户在应用的唯一账号标识，同一个用户在不同应用的openid不一样。
    @Column({
        length: 40,
        comment: "qq open id",
    })
    open_uuid: string;

    // union_uuid: QQ用户在开发者在多个应用间（打通后）的标识，打通后，不同应用的unionid一样
    @Column({
        length: 40,
        comment: "qq union id",
    })
    union_uuid: string;

    @Index("user_qq_is_delete_index")
    @Column({
        default: false,
    })
    is_delete: boolean;
}
