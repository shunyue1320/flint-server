import { DataSource } from "typeorm";
import { MySQL } from "../constants/Config";

export const dataSource = new DataSource({
    type: "mysql",
    host: MySQL.host,
    port: MySQL.port,
    username: MySQL.username,
    password: MySQL.password,
    database: MySQL.db,
    entities: [],
});

export const orm = (): Promise<DataSource> => {
    return dataSource.initialize().catch(err => {
        console.error("数据源初始化期间出错", err);
        process.exit(1);
    });
};
