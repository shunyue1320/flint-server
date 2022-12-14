import { DataSource } from "typeorm";
import { MySQL, isDev, isTest } from "../constants/Config";
import { UserModel } from "../model/user/User";
import { UserPhoneModel } from "../model/user/Phone";
import { UserWeChatModel } from "../model/user/WeChat";
import { UserGithubModel } from "../model/user/Github";
import { UserQQModel } from "../model/user/QQ";
import { RoomModel } from "../model/room/Room";
import { RoomUserModel } from "../model/room/RoomUser";
import { RoomRecordModel } from "../model/room/RoomRecord";

export const dataSource = new DataSource({
    type: "mysql",
    host: MySQL.host,
    port: MySQL.port,
    username: MySQL.username,
    password: MySQL.password,
    database: MySQL.db,
    entities: [
        UserModel,
        UserPhoneModel,
        UserWeChatModel,
        UserGithubModel,
        UserQQModel,
        RoomModel,
        RoomUserModel,
        RoomRecordModel,
    ],
    extra: {
        connectionLimit: isTest ? 50 : 10,
    },
    timezone: "Z",
    logging: !isTest && isDev ? "all" : false,
    maxQueryExecutionTime: !isTest && isDev ? 1 : 1000,
    charset: "utf8mb4_unicode_ci",
});

export const orm = (): Promise<DataSource> => {
    return dataSource.initialize().catch(err => {
        console.error("数据源初始化期间出错", err);
        process.exit(1);
    });
};
