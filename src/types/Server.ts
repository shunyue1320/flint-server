import {
    FastifyInstance as FI,
    FastifyRequest,
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
} from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { EntityManager } from "typeorm";
import { Status, LoginPlatform } from "../constants/Project";
import { ErrorCode } from "../error/ErrorCode";

export type ResponseError = {
    status: Status.Failed | Status.AuthFailed;
    code: ErrorCode;
};

export type ResponseSuccess<T = any> = {
    status: Status.Success;
    data: T;
};

export type Response<T = any> =
    | ResponseError
    | ResponseSuccess<T>
    | {
          status: Status.Process;
      };

export type FastifyInstance<S extends RawServerDefault = RawServerDefault> = FI<
    S,
    RawRequestDefaultExpression<S>,
    RawReplyDefaultExpression<S>,
    FastifyBaseLogger,
    TypeBoxTypeProvider
>;

export type FastifyRequestTypebox<SCHEMA> = FastifyRequest<
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    SCHEMA,
    TypeBoxTypeProvider
> & {
    DBTransaction: EntityManager;
    userUUID: string;
    loginSource: LoginPlatform;
};
