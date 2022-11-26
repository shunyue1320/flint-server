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

    public async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    public async del(key: string | string[]): Promise<void> {
        await this.client.del(typeof key === "string" ? [key] : key);
    }

    /**  Incr 命令将 key 中储存的数字值增一，如果 key 不存在，那么 key 的值会先被初始化为 0  */
    public async incr(key: string): Promise<number> {
        return await this.client.incr(key);
    }

    /** 以秒为单位返回 key 的剩余过期时间 */
    public async ttl(key: string): Promise<number> {
        return await this.client.ttl(key);
    }

    /** 命令用于设置 key 的过期时间，key 过期后将不再可用。单位以秒计 */
    public async expire(key: string, seconds: number): Promise<void> {
        await this.client.expire(key, seconds);
    }

    /** 返回所有(一个或多个)给定key的值。 key不存在则返回null */
    public async mget(keys: string[]): Promise<(string | null)[]> {
        if (keys.length === 0) {
            return [];
        }
        return await this.client.mget(keys);
    }

    /** redis 查找所有的 keys， 返回第一个不存在的 key */
    public async vacantKey(keys: string[]): Promise<string | null> {
        const valueResult = await this.mget(keys);

        for (let i = 0; i < valueResult.length; i++) {
            const value = valueResult[i];
            // 返回第一个不存在的 key
            if (value === null) {
                return keys[i];
            }
        }

        return null;
    }
}

export default new RedisService();
