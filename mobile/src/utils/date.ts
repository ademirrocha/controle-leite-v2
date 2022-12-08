export const addDays = (date: Date|string,  days: number) => {
    date = new Date(date);
    date.setDate(date.getDate() + days);
    return date;
}

export const substractDays = (date: Date|string,  days: number) => {
    date = new Date(date);
    date.setDate(date.getDate() - days);
    return date;
}

export const substractMinutes = (date: Date|string,  minutes: number) => {
    date = new Date(date);
    date.setMinutes(date.getMinutes() - minutes);
    return date;
}

export const addMinutes = (date: Date|string,  minutes: number) => {
    date = new Date(date);
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}