import { AbstractLogin } from "../../../../abstract/login";
import { LoginClassParams } from "../../../../abstract/login/Type";
import { UserService } from "../../../services/user/User";
import { UserPhoneService } from "../../../services/user/UserPhone";

export class LoginPhone extends AbstractLogin {
    public readonly svc: RegisterService;

    constructor(params: LoginClassParams) {
        super(params);
        this.svc = {
            user: new UserService(this.DBTransaction, this.userUUID),
            userPhone: new UserPhoneService(this.DBTransaction, this.userUUID),
        };
    }

    public async register(data: RegisterInfo): Promise<void> {
        const info = {
            ...data,
            userName: data.phone.slice(-4),
        };
        await this.svc.user.create(info);
        await this.svc.userPhone.create(info);
    }
}

interface RegisterService {
    user: UserService;
    userPhone: UserPhoneService;
}

interface RegisterInfo {
    avatarURL: string;
    phone: string;
}
