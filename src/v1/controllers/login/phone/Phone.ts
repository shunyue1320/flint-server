import { v4 } from "uuid";
import { Type } from "@sinclair/typebox";
import RedisService from "../../../../thirdPartyService/RedisService";
import { FastifyRequestTypebox, Response } from "../../../../types/Server";
import { SMSUtils } from "../../../../utils/SMS";
import { RedisKey } from "../../../../utils/Redis";
import { ErrorCode } from "../../../../error/ErrorCode";
import { ControllerError } from "../../../../error/ControllerError";
import { ExhaustiveAttackCount, ExhaustiveAttackExpirationSecond } from "./Constants";
import { PhoneSMS, Server } from "../../../../constants/Config";
import { userPhoneDAO } from "../../../dao";
import { LoginPhone } from "../platforms/LoginPhone";
import { LoginPlatform, Status } from "../../../../constants/Project";
import { FastifyReply } from "fastify";

export const phoneLoginSchema = {
    body: Type.Object(
        {
            phone: Type.String({
                format: "phone",
            }),
            code: Type.Integer({
                minimum: 100000,
                maximum: 999999,
            }),
        },
        {
            additionalProperties: false,
        },
    ),
};

/** 判断是否穷举攻击: 特定时间内持续登录10次 */
const notExhaustiveAttack = async (safePhone: string): Promise<void> => {
    const key = RedisKey.phoneTryLoginCount(safePhone);
    const value = Number(await RedisService.get(key)) || 0;

    if (value > ExhaustiveAttackCount) {
        throw new ControllerError(ErrorCode.ExhaustiveAttack);
    }

    const inrcValue = await RedisService.incr(key);
    if (inrcValue === 1) {
        // 必须重新等待10分钟
        await RedisService.expire(key, ExhaustiveAttackExpirationSecond);
    }
};

/** 断言验证码是否正确 */
const assertCodeCorrect = async (safePhone: string, code: number): Promise<void> => {
    // 开发环境不校验测试手机号
    if (Server.env === "dev") {
        for (const user of PhoneSMS.testUsers) {
            if (user.phone === safePhone && user.code === code) {
                return;
            }
        }
    }

    const value = await RedisService.get(RedisKey.phoneLogin(safePhone));
    if (String(code) !== value) {
        throw new ControllerError(ErrorCode.SMSVerificationCodeInvalid);
    }
};

/** 清除尝试登录计数 */
const clearTryLoginCount = async (safePhone: string): Promise<void> => {
    await RedisService.del(RedisKey.phoneTryLoginCount(safePhone));
};

/** 清除redis验证码 */
const clearVerificationCode = async (safePhone: string): Promise<void> => {
    await RedisService.del(RedisKey.phoneLogin(safePhone));
};

export const phoneLogin = async (
    req: FastifyRequestTypebox<typeof phoneLoginSchema>,
    reply: FastifyReply,
): Promise<Response<ResponseType>> => {
    const { phone, code } = req.body;
    const safePhone = SMSUtils.safePhone(phone);

    await notExhaustiveAttack(safePhone);
    await assertCodeCorrect(safePhone, code);
    await clearTryLoginCount(safePhone);

    // 去数据库找该手机号是否注册过
    const { user_uuid: userUUIDByDB } = await userPhoneDAO.findOne(req.DBTransaction, "user_uuid", {
        phone_number: String(phone),
    });
    const userUUID = userUUIDByDB || v4();

    const loginPhone = new LoginPhone({
        DBTransaction: req.DBTransaction,
        userUUID,
    });

    // 该手机号没有注册，则注册该用户
    if (!userUUIDByDB) {
        await loginPhone.register({
            phone,
            // 用户默认头像
            avatarURL:
                "https://flat-storage.oss-cn-hangzhou.aliyuncs.com/flat-resources/avatar/default-00.png",
        });
    }

    const { userName, avatarURL } = await loginPhone.svc.user.nameAndAvatar();

    const result = {
        status: Status.Success,
        data: {
            name: userName,
            avatar: avatarURL,
            userUUID,
            token: await reply.jwtSign({
                userUUID,
                loginSource: LoginPlatform.Phone,
            }),
            hasPhone: true,
        },
    } as const;

    await clearVerificationCode(safePhone);

    return result;
};

interface ResponseType {
    name: string;
    avatar: string;
    userUUID: string;
    token: string;
    hasPhone: boolean;
}
