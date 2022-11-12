import { Status } from "../constants/Project";
import { ErrorCode } from "./ErrorCode";
import { ResponseError } from "../types/Server";
import { FlintError } from "./FlintError";

export class FError extends FlintError {
    constructor(
        public errorCode: ErrorCode,
        public status: ResponseError["status"] = Status.Failed,
    ) {
        super(`${status}: ${errorCode}`);
    }
}

export class ControllerError extends FlintError {
    constructor(
        public errorCode: ErrorCode,
        public status: ResponseError["status"] = Status.Failed,
    ) {
        super(`${status}: ${errorCode}`);
        this.name = "ControllerError";
    }
}
