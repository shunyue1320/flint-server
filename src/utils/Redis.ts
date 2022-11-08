export const RedisKey = {
    phoneLogin: (phone: string): string => `phone:login:${phone}`,
};
