import IORedis from "ioredis";
import { Redis } from "../constants/Config";

class RedisService {
    public readonly client: IORedis;

    public constructor() {
        this.client = new IORedis({
            host: Redis.host,
            port: Redis.port,
            username: Redis.username,
            password: Redis.password,
            db: Redis.db,
        });
    }

    public async set(key: string, value: string, expire?: number): Promise<string | null> {
        // 没有过期时间
        if (typeof expire === "undefined") {
            return await this.client.set(key, value);
        }
        // 有过期时间
        return await this.client.set(key, value, "EX", expire);
    }

    public async ttl(key: string): Promise<number> {
        return await this.client.ttl(key);
    }
}

export default new RedisService();
