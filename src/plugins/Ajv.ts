import Ajv, { FormatDefinition } from "ajv";
import { parsePhoneNumber } from "awesome-phonenumber";

const phone: FormatDefinition<string> = {
    validate: (phone: string) => {
        if (phone[0] !== "+") {
            return false;
        }
        const pn = parsePhoneNumber(phone);
        return pn.isValid();
    },
};

export const ajvSelfPlugin = (ajv: Ajv): void => {
    ajv.addFormat("phone", phone);
};
