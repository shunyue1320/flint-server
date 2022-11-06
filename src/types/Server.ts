import {
    FastifyInstance as FI,
    FastifyRequest,
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyLoggerInstance,
} from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { EntityManager } from "typeorm";
import { Status, LoginPlatform } from "../constants/Project";

export type Response<T = any> = {
    status: Status.Success;
    data: T;
};

export type FastifyInstance<S extends RawServerDefault = RawServerDefault> = FI<
    S,
    RawRequestDefaultExpression<S>,
    RawReplyDefaultExpression<S>,
    FastifyLoggerInstance,
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
