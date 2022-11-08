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

    public async ttl(key: string): Promise<number> {
        return await this.client.ttl(key);
    }
}

export default new RedisService();
