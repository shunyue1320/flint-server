import Ajv, { FormatDefinition } from "ajv";
import { parsePhoneNumber } from "awesome-phonenumber";
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

export const ajvSelfPlugin = (ajv: Ajv): void => {
    // https://ajv.js.org/guide/formats.html#user-defined-formats
    ajv.addFormat("phone", phone);
    ajv.addFormat("uuid-v4", uuidV4);
};
