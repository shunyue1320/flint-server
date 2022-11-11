import { cloneDeep } from "lodash";

export enum FilterValue {
    EMPTY_OBJECT,
    UNDEFINED,
    NULL,
    EMPTY_STRING,
    NAN,
}

export const removeEmptyValue = <
    O extends RecursionObject<string | number | boolean | undefined | null | Date>,
>(
    obj: O,
    filter: FilterValue[],
): O => {
    const object = cloneDeep(obj);
    const keys = Object.keys(object);

    for (const key of keys) {
        const value = object[key];

        switch (typeof value) {
            case "object": {
                if (value === null) {
                    if (filter.includes(FilterValue.NULL)) {
                        delete object[key];
                    }
                } else if (
                    Object.keys(value).length === 0 &&
                    filter.includes(FilterValue.EMPTY_OBJECT)
                ) {
                    delete object[key];
                } else {
                    // @ts-ignore
                    object[key] = removeEmptyValue(value as O, filter);
                }
                break;
            }
            case "string": {
                if (value === "" && filter.includes(FilterValue.EMPTY_STRING)) {
                    delete object[key];
                }
                break;
            }
            case "number": {
                if (Number.isNaN(value) && filter.includes(FilterValue.NAN)) {
                    delete object[key];
                }
                break;
            }
            case "undefined": {
                if (filter.includes(FilterValue.UNDEFINED)) {
                    delete object[key];
                }
                break;
            }
        }
    }
    return object;
};
