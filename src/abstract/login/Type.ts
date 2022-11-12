import { EntityManager } from "typeorm";

export interface LoginClassParams {
    userUUID: string;
    DBTransaction: EntityManager;
}
