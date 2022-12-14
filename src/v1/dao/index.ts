import { EntityTarget, FindOptionsWhere } from "typeorm";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { Model } from "../../model";
import { UserPhoneModel } from "../../model/user/Phone";
import { UserModel } from "../../model/user/User";
import { UserWeChatModel } from "../../model/user/WeChat";
import { UserGithubModel } from "../../model/user/Github";
import { UserQQModel } from "../../model/user/QQ";
import { RoomModel } from "../../model/room/Room";
import { RoomUserModel } from "../../model/room/RoomUser";
import { RoomRecordModel } from "../../model/room/RoomRecord";

class DAO<M extends Model> {
    public constructor(private readonly model: EntityTarget<M>) {}

    public async findOne<T extends keyof M>(
        t: EntityManager,
        select: T,
        where: FindOptionsWhere<M>,
        order?: [keyof M & string, "ASC" | "DESC"],
    ): Promise<Partial<Pick<M, T>>>;
    public async findOne<T extends keyof M>(
        t: EntityManager,
        select: T[],
        where: FindOptionsWhere<M>,
        order?: [keyof M & string, "ASC" | "DESC"],
    ): Promise<Pick<M, T> | null>;
    public async findOne<T extends keyof M>(
        t: EntityManager,
        select: T | T[],
        where: FindOptionsWhere<M>,
        order?: [keyof M & string, "ASC" | "DESC"],
    ): Promise<Pick<M, T>> {
        let sql = t
            .getRepository(this.model)
            .createQueryBuilder()
            .select(DAOUtils.select(select))
            .where(DAOUtils.softDelete(where));

        if (order) {
            sql = sql.orderBy(...order);
        }

        const result = await sql.getRawOne();
        if (Array.isArray(select)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return result || null;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result || {};
    }

    public async find<T extends keyof M>(
        t: EntityManager,
        select: T | T[],
        where: FindOptionsWhere<M>,
        config?: {
            order?: [keyof M & string, "ASC" | "DESC"];
            distinct?: boolean;
            limit?: number;
            offset?: number;
        },
    ): Promise<Pick<M, T>[]> {
        let sql = t
            .getRepository(this.model)
            .createQueryBuilder()
            .select(DAOUtils.select(select))
            .where(DAOUtils.softDelete(where))
            .limit(config?.limit)
            .offset(config?.offset); // ??????????????????

        // ?????????????????????
        if (config?.distinct) {
            sql = sql.distinct(config.distinct);
        }

        // ????????????
        if (config?.order) {
            sql = sql.orderBy(...config.order);
        }

        return await sql.getRawMany();
    }

    public async insert<D extends QueryDeepPartialEntity<M>>(
        t: EntityManager,
        data: D | D[],
        config?: {
            orUpdate?: (keyof D & string)[];
            orIgnore?: boolean;
        },
    ): Promise<void> {
        let sql = t
            .createQueryBuilder()
            .insert()
            .into(this.model)
            .values(data)
            .orIgnore(config?.orIgnore); // ??????????????????????????????????????????

        if (config?.orUpdate) {
            sql = sql.orUpdate(config.orUpdate); // ???????????????????????? orUpdate ???????????????
        }

        await sql.execute();
    }

    public async update(
        t: EntityManager,
        updateData: QueryDeepPartialEntity<M>,
        where: FindOptionsWhere<M>,
        config?: {
            order?: [keyof M & string, "ASC" | "DESC"];
            limit?: number;
        },
    ): Promise<void> {
        let sql = t
            .createQueryBuilder()
            .update(this.model)
            .set(updateData)
            .where(DAOUtils.softDelete(where))
            .limit(config?.limit); // ???????????????

        if (config?.order) {
            sql = sql.orderBy(...config.order);
        }

        await sql.execute();
    }

    /** ????????????????????????????????? */
    public async delete(t: EntityManager, where: FindOptionsWhere<M>): Promise<void> {
        await this.update(
            t,
            // @ts-ignore
            { is_delete: true },
            where,
        );
    }

    public async count(t: EntityManager, where: FindOptionsWhere<M>): Promise<number> {
        return await t.getRepository(this.model).count({
            where: DAOUtils.softDelete(where),
        });
    }

    /** ?????????????????????????????? */
    public async deleteHard(t: EntityManager, where: FindOptionsWhere<M>): Promise<void> {
        await t.createQueryBuilder().delete().from(this.model).where(where).execute();
    }
}

class DAOUtils {
    public static softDelete<T>(where: T): T {
        return {
            ...where,
            is_delete: false,
        };
    }

    public static select<T>(s: T | T[]): (T & string)[] {
        return (Array.isArray(s) ? s : [s]) as (T & string)[];
    }
}

export const userDAO = new DAO(UserModel);
export const userPhoneDAO = new DAO(UserPhoneModel);
export const userWeChatDAO = new DAO(UserWeChatModel);
export const userGithubDAO = new DAO(UserGithubModel);
export const userQQDAO = new DAO(UserQQModel);
export const RoomDAO = new DAO(RoomModel);
export const RoomUserDAO = new DAO(RoomUserModel);
export const RoomRecordDAO = new DAO(RoomRecordModel);
