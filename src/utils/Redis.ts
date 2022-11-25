export const RedisKey = {
    authUUID: (uuid: string): string => `auth:uuid:${uuid}`,
    authFailed: (authUUID: string): string => `auth:failed:${authUUID}`,
    authUserInfo: (authUUID: string): string => `auth:userInfo:${authUUID}`,
    phoneLogin: (phone: string): string => `phone:login:${phone}`,
    phoneTryLoginCount: (phone: string): string => `phone:count:login:${phone}`,
    roomInviteCodeReverse: (roomUUID: string): string => `room:inviteReverse:${roomUUID}`,
};
