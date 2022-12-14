import { EntityManager } from "typeorm";
import { Gender } from "../../../constants/Project";
import { FError } from "../../../error/ControllerError";
import { ErrorCode } from "../../../error/ErrorCode";
import { userDAO } from "../../dao";

export class UserService {
    constructor(private readonly DBTransaction: EntityManager, private readonly userUUID: string) {}

    public async create(data: {
        userName: string;
        avatarURL: string;
        gender?: Gender;
    }): Promise<void> {
        const { userName, avatarURL, gender } = data;
        return await userDAO.insert(this.DBTransaction, {
            user_name: userName,
            user_uuid: this.userUUID,
            avatar_url: avatarURL,
            gender,
            user_password: "",
        });
    }

    public async nameAndAvatar(): Promise<{
        userName: string;
        avatarURL: string;
    } | null> {
        const result = await userDAO.findOne(this.DBTransaction, ["user_name", "avatar_url"], {
            user_uuid: this.userUUID,
        });

        if (result) {
            return {
                userName: result.user_name,
                avatarURL: result.avatar_url,
            };
        }

        return null;
    }

    /** 断言是否存在该用户 */
    public async assertGetNameAndAvatar(): Promise<{
        userName: string;
        avatarURL: string;
    }> {
        const result = await this.nameAndAvatar();

        if (result === null) {
            throw new FError(ErrorCode.UserNotFound);
        }

        return result;
    }
}
