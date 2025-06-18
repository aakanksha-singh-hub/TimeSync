import { DateTime } from 'luxon';

// Function to get the current local time for a given IANA time zone
export const getCurrentLocalTime = (timeZone: string): string => {
    return DateTime.now().setZone(timeZone).toLocaleString(DateTime.DATETIME_MED);
};

// Function to get the UTC offset for a given IANA time zone
export const getUTCOffset = (timeZone: string): string => {
    const offset = DateTime.now().setZone(timeZone).offset;
    return `UTC${offset >= 0 ? '+' : ''}${offset / 60}`;
};

// Function to format a given date/time in a specific time zone
export const formatDateTimeInTimeZone = (dateTime: Date, timeZone: string, format: string): string => {
    return DateTime.fromJSDate(dateTime).setZone(timeZone).toFormat(format);
};

// Function to convert a given date/time from one time zone to another
export const convertTimeZone = (dateTime: Date, fromTimeZone: string, toTimeZone: string): string => {
    return DateTime.fromJSDate(dateTime).setZone(fromTimeZone).setZone(toTimeZone).toString();
};