import {DateTime, Duration} from "luxon";


export function isStringNullOrBlank(s: string) : boolean {
    return (typeof s === "undefined" ||
        s === null ||
        s.length === 0 ||
        s.trim().length === 0);
}

export function formatDateTime(dt: DateTime) : string {
    return dt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
}

export function prettyDuration(duration: Duration) : string {
    return duration.rescale().toHuman();
}

export default {
    isStringNullOrBlank,
    formatDateTime,
    prettyDuration
}
