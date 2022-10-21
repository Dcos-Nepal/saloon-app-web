import { DateTime } from "luxon";

export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const getFormattedDate = (date: Date, prefomattedDate: string = '', hideYear = false) => {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes: any = date.getMinutes();

    if (minutes < 10) {
        // Adding leading zero to minutes
        minutes = `0${minutes}`;
    }

    if (prefomattedDate) {
        // Today at 10:20
        // Yesterday at 10:20
        return `${prefomattedDate} at ${hours}:${minutes}`;
    }

    if (hideYear) {
        // 10. January at 10:20
        return `${day}. ${month} at ${hours}:${minutes}`;
    }

    // 10. January 2017. at 10:20
    return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
}

// --- Main function
export const timeAgo = (dateParam: any) => {
    if (!dateParam) {
        return null;
    }

    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today: any = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    // const isToday = today.toDateString() === date.toDateString();
    // const isYesterday = yesterday.toDateString() === date.toDateString();
    // const isThisYear = today.getFullYear() === date.getFullYear();

    if (seconds < 5) {
        return 'now';
    } else if (seconds < 60) {
        return `${seconds} seconds ago`;
    } else if (seconds < 90) {
        return 'about a minute ago';
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    }
    // } else if (isToday) {
    //     return getFormattedDate(date, 'Today'); // Today at 10:20
    // } else if (isYesterday) {
    //     return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
    // } else if (isThisYear) {
    //     return getFormattedDate(date, '', true); // 10. January at 10:20
    // }

    return getFormattedDate(date, ''); // 10. January 2017. at 10:20
}

/**
 * Displays the elapsed time form given date and time
 * @param startTime 
 * @returns string
 */
export const getElapsedTime = (startTime: Date) => {

    // Record end time
    let endTime = new Date();

    // Compute time difference in milliseconds
    let timeDiff = endTime.getTime() - startTime.getTime();

    // Convert time difference from milliseconds to seconds
    timeDiff = timeDiff / 1000;

    // Extract integer seconds t18hat dont form a minute using %
    let seconds = Math.floor(timeDiff % 60); //ignoring uncomplete seconds (floor)

    // Pad seconds with a zero if neccessary
    let secondsAsString = seconds < 10 ? "0" + seconds : seconds + "";

    // Convert time difference from seconds to minutes using %
    timeDiff = Math.floor(timeDiff / 60);

    // Extract integer minutes that don't form an hour using %
    let minutes = timeDiff % 60; //no need to floor possible incomplete minutes, becase they've been handled as seconds

    // Pad minutes with a zero if neccessary
    let minutesAsString = minutes < 10 ? "0" + minutes : minutes + "";

    // Convert time difference from minutes to hours
    timeDiff = Math.floor(timeDiff / 60);

    // Extract integer hours that don't form a day using %
    let hours = timeDiff % 24; //no need to floor possible incomplete hours, becase they've been handled as seconds

    // Convert time difference from hours to days
    timeDiff = Math.floor(timeDiff / 24);

    // The rest of timeDiff is number of days
    let days = timeDiff;

    let totalHours = hours + (days * 24); // add days to hours
    let totalHoursAsString = totalHours < 10 ? "0" + totalHours : totalHours + "";

    if (totalHoursAsString === "00") {
        return minutesAsString + "m:" + secondsAsString + "s";
    } else {
        if (days) {
            return days + "days " + totalHoursAsString + "h " + minutesAsString + "m " + secondsAsString + "s";
        }
        return totalHoursAsString + "h " + minutesAsString + "m " + secondsAsString + "s";
    }
}

/**
 * Calculate duration
 * @param options
 * @returns String
 */
export const calculateJobDuration = (options: { endDate: string; startDate: string }) => {
    const foundDates = [];
    const date1 = DateTime.fromISO(options?.endDate);
    const date2 = DateTime.fromISO(options?.startDate);
    const { years, months, days, hours, minutes, seconds } = date1.diff(date2, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);

    if (years) foundDates.push(`${years.toFixed(0)}yrs`);
    if (months) foundDates.push(`${months.toFixed(0)}mon`);
    if (days) foundDates.push(`${days.toFixed(0)}days`);
    if (hours) foundDates.push(`${hours.toFixed(0)}hrs`);
    if (minutes) foundDates.push(`${minutes.toFixed(0)}min`);
    if (seconds) foundDates.push(`${seconds.toFixed(0)}sec`);

    return foundDates.join(' ');
};