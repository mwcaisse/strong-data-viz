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

export function startOfWeek(dt: DateTime, startOnSunday: boolean = true) {
    // Luxon by default assumes that the week starts on Monday, this translates it to starting on Sunday
    if (startOnSunday) {
        return dt.plus({day: 1}).startOf("week")
            .minus({day: 1});
    }
    return dt.startOf("week");

}

export default {
    isStringNullOrBlank,
    formatDateTime,
    prettyDuration,
    startOfWeek
}
