import { formatInTimeZone } from 'date-fns-tz';
import { DATE_FORMATS } from 'src/app/core/constants';


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
