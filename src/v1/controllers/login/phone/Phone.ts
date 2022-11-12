import { Type } from "@sinclair/typebox";
import RedisService from "../../../../thirdPartyService/RedisService";
import { FastifyRequestTypebox, Response } from "../../../../types/Server";
import { SMS, SMSUtils } from "../../../../utils/SMS";
import { RedisKey } from "../../../../utils/Redis";
import { ErrorCode } from "../../../../error/ErrorCode";
import { ControllerError } from "../../../../error/ControllerError";
import { ExhaustiveAttackCount, ExhaustiveAttackExpirationSecond } from "./Constants";
import { PhoneSMS, Server } from "../../../../constants/Config";

export const phoneSchema = {
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

export const phoneLogin = async (
    req: FastifyRequestTypebox<typeof phoneSchema>,
): Promise<Response<ResponseType>> => {
    const { phone, code } = req.body;
    const safePhone = SMSUtils.safePhone(phone);

    await notExhaustiveAttack(safePhone);
    await assertCodeCorrect(safePhone, code);
    await clearTryLoginCount(safePhone);

    // @todo: 用户注册登录逻辑

    return;
};

interface ResponseType {
    name: string;
    avatar: string;
    userUUID: string;
    token: string;
    hasPhone: true;
}
