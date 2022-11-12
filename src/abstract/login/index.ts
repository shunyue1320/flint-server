import { LoginClassParams } from "./Type";
import { EntityManager } from "typeorm";

export abstract class AbstractLogin {
    protected readonly userUUID: string;
    protected readonly DBTransaction: EntityManager;

    protected constructor(params: LoginClassParams) {
        this.userUUID = params.userUUID;
        this.DBTransaction = params.DBTransaction;
    }

    public abstract register(info: any): Promise<void>;
}
