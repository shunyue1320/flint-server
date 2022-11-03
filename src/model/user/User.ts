import { Column, Entity, Index } from "typeorm";
import { Content } from "../Content";

@Entity({
    name: "users",
})
export class UserModel extends Content { }
