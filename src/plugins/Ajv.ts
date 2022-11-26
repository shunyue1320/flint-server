import Ajv, { FormatDefinition } from "ajv";
import { parsePhoneNumber } from "awesome-phonenumber";
import { isValid } from "date-fns/fp";
import { validate as uuidValidate, version as uuidVersion } from "uuid";

const phone: FormatDefinition<string> = {
    validate: (phone: string) => {
        if (phone[0] !== "+") {
            return false;
        }
        const pn = parsePhoneNumber(phone);
        return pn.isValid();
    },
};

const uuidV4: FormatDefinition<string> = {
    validate: uuid => {
        return uuidValidate(uuid) && uuidVersion(uuid) === 4;
    },
};

const unixTimestamp: FormatDefinition<number> = {
    type: "number",
    validate: date => {
        // 必须是毫秒时间戳
        if (String(date).length !== 13) {
            return false;
        }

        return isValid(date);
    },
};

export const ajvSelfPlugin = (ajv: Ajv): void => {
    // https://ajv.js.org/guide/formats.html#user-defined-formats
    ajv.addFormat("phone", phone);
    ajv.addFormat("uuid-v4", uuidV4);
    ajv.addFormat("unix-timestamp", unixTimestamp);
};
