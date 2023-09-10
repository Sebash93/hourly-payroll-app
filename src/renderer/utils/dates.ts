import { differenceInHours, differenceInMinutes } from 'date-fns';
import config from './config';

export const fromDateToTimestamp = (date: Date): number => {
  return date.getTime();
};

export const fromTimestampToDate = (timestamp: number): Date => {
  return new Date(timestamp);
};

export const fromTimestampToHumanDate = (timestamp: number): string => {
  return fromTimestampToDate(timestamp).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const differenceInMinutesOrFail = (start: Date, end: Date): number => {
  const minutesDifference = differenceInMinutes(end, start);
  if (minutesDifference < 0) {
    throw new Error('La fecha de inicio debe ser menor a la fecha de fin');
  }
  return minutesDifference;
};

export const hoursWithoutBreaks = (
  { startTime, endTime }: { startTime: Date; endTime: Date },
  {
    firstBreak,
    secondBreak,
  }: { firstBreak: boolean | undefined; secondBreak: boolean | undefined }
): number => {
  let breakMinutes = firstBreak ? config.MINUTES_PER_BREAK : 0;
  breakMinutes += secondBreak ? config.MINUTES_PER_BREAK : 0;
  const workingMinutes = differenceInMinutesOrFail(startTime, endTime);
  return parseFloat(((workingMinutes - breakMinutes) / 60).toFixed(2));
};

export const SHORT_DATE_FORMAT = 'dd/MMM/yyyy';
