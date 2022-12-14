import { Column, Entity, Index } from "typeorm";
import { Content } from "../Content";
import { Gender } from "../../constants/Project";

@Entity({
    name: "users",
})
export class UserModel extends Content {
    @Index("users_user_uuid_uindex", {
        unique: true,
    })
    @Column({
        length: 40,
    })
    user_uuid: string;

    @Column({
        precision: 32,
    })
    user_name: string;

    @Column({
        precision: 32,
    })
    user_password: string;

    @Column({
        length: 2083,
    })
    avatar_url: string;

    @Column({
        type: "enum",
        enum: [Gender.Man, Gender.Woman, Gender.None],
        default: Gender.None,
    })
    gender: Gender;

    @Index("users_is_delete_index")
    @Column({
        default: false,
    })
    is_delete: boolean;
}
