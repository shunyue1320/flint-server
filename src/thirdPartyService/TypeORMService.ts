import { DataSource } from "typeorm";
import { MySQL, isDev, isTest } from "../constants/Config";

export const dataSource = new DataSource({
    type: "mysql",
    host: MySQL.host,
    port: MySQL.port,
    username: MySQL.username,
    password: MySQL.password,
    database: MySQL.db,
    entities: [],
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
