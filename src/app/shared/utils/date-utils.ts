import { isToday, isYesterday } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { DATE_FORMATS } from 'src/app/core/constants';


export interface DateTimePickerResult {
    day: string;
    month: string;
    year: string;
    hour: string;
    minute: string;
    meridiem: 'AM' | 'PM';
};

export function formatToLocalTime(utcMs: number, fmt: string = DATE_FORMATS.FULL): string {
    try {
        // Convert milliseconds → Date
        const utcDate = new Date(utcMs);

        // Get user's local timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Format into readable text
        return formatInTimeZone(utcDate, tz, fmt);
    } catch (err) {
        console.error('Time conversion failed:', err);
        return '';
    }
}



export function toUtcTimestamp(result: DateTimePickerResult): number {
    let hour = Number(result.hour);

    // convert 12h → 24h
    if (result.meridiem === 'PM' && hour < 12) hour += 12;
    if (result.meridiem === 'AM' && hour === 12) hour = 0;

    // local date string
    const localDate = new Date(
        Number(result.year),
        Number(result.month) - 1,
        Number(result.day),
        hour,
        Number(result.minute),
        0
    );

    // Get user's local timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcDate = fromZonedTime(localDate, tz);

    return utcDate.getTime();
}


export function formatChatListTime(utcMs: number): string {
    try {
        const utcDate = new Date(utcMs);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Convert to local time zone
        const localDate = new Date(
            formatInTimeZone(utcDate, tz, DATE_FORMATS.DATE_TIME)
        );

        if (isToday(localDate)) {
            return formatInTimeZone(utcDate, tz, DATE_FORMATS.TIME);
        }

        if (isYesterday(localDate)) {
            return 'Yesterday';
        }

        return formatInTimeZone(utcDate, tz, DATE_FORMATS.DATE_ONLY);

    } catch (err) {
        console.error('Chat time formatting failed:', err);
        return '';
    }
}


