type RecursionObject<T> = {
    [key in string]: T | RecursionObject<T>;
};
