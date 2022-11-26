import { createHmac } from "crypto";
import { v1 as uuidv1 } from "uuid";
import { Whiteboard } from "../constants/Config";

export enum TokenRole {
    Admin = "0",
    Writer = "1",
    Reader = "2",
}

export enum TokenPrefix {
    SDK = "NETLESSSDK_",
    ROOM = "NETLESSROOM_",
    TASK = "NETLESSTASK_",
}

const bufferToBase64 = (buffer: Buffer): string => {
    return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/** 对象key排序 */
const formatJSON = <T extends StrAndIntByObj>(object: T): StrByObj => {
    const keys = Object.keys(object).sort();
    const target: StrByObj = {};

    for (const key of keys) {
        target[key] = String(object[key]);
    }
    return target;
};

/** 对象转url字符串 */
const stringify = (object: StrByObj): string => {
    return Object.keys(object)
        .map(key => {
            const value = object[key];

            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join("&");
};

/** 通过 accessKey 计算出一个 token */
const createToken = <T extends SdkTokenTags | RoomTokenTags>(
    prefix: TokenPrefix,
): ((accessKey: string, secretAccessKey: string, lifespan: number, content: T) => string) => {
    return (accessKey: string, secretAccessKey: string, lifespan: number, content: T) => {
        const object: StrAndIntByObj = {
            ...content,
            ak: accessKey,
            nonce: uuidv1(),
        };

        if (lifespan > 0) {
            object.expireAt = `${Date.now() + lifespan}`;
        }

        // 加密内容
        const information = JSON.stringify(formatJSON(object));
        // 声网 secretAccessKey 加密密钥
        const hmac = createHmac("sha256", secretAccessKey);
        object.sig = hmac.update(information).digest("hex");

        const query = stringify(formatJSON(object));
        const buffer = Buffer.from(query, "utf8");

        return prefix + bufferToBase64(buffer);
    };
};

const sdkToken = createToken<SdkTokenTags>(TokenPrefix.SDK);
const taskToken = createToken<RoomTokenTags>(TokenPrefix.TASK);

export const createWhiteboardSDKToken = (lifespan = 1000 * 60 * 10): string => {
    return sdkToken(Whiteboard.accessKey, Whiteboard.secretAccessKey, lifespan, {
        role: TokenRole.Admin,
    });
};

/** 返回一个通过声网 accessKey 计算出的 token */
export const createWhiteboardTaskToken = (
    whiteboardTaskUUID: string,
    { lifespan = 0 }: { lifespan?: number } = {},
): string => {
    return taskToken(Whiteboard.accessKey, Whiteboard.secretAccessKey, lifespan, {
        uuid: whiteboardTaskUUID,
        role: TokenRole.Reader,
    });
};

type StrByObj = Record<string, string>;
type StrAndIntByObj = Record<string, string | number>;
interface RoomTokenTags {
    readonly uuid: string;
    readonly role: TokenRole;
}
interface SdkTokenTags {
    readonly role: TokenRole;
}
