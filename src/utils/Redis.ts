export const RedisKey = {
    phoneLogin: (phone: string): string => `phone:login:${phone}`,
    phoneTryLoginCount: (phone: string): string => `phone:count:login:${phone}`,
};
