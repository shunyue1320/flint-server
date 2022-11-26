import { subMinutes, compareDesc, differenceInMilliseconds } from "date-fns/fp";

/**  传入时间 不能小于 当前时间减一分钟。小于则返回 true */
export const timeExceedRedundancyOneMinute = (time: number): boolean => {
    // 当前时间剪去1分钟
    const redundancyTime = subMinutes(1)(Date.now());
    // 预约的时间小于 redundancyTime 返回 -1
    return compareDesc(time)(redundancyTime) === -1;
};

// 开始时间 > 结束时间 返回 true
export const beginTimeLessEndTime = (beginTime: number, endTime: number): boolean => {
    return compareDesc(endTime)(beginTime) === -1;
};

const timeIntervalLessThanOrEqualMinute = (
    beginTime: number,
    endTime: number,
    minute: number,
): boolean => {
    return differenceInMilliseconds(beginTime, endTime) < minute;
};

export const timeIntervalLessThanFifteenMinute = (beginTime: number, endTime: number): boolean => {
    return timeIntervalLessThanOrEqualMinute(beginTime, endTime, 1000 * 60 * 15);
};
