/* eslint-disable import/prefer-default-export */
import {
  isSaturday as checkIsSaturday,
  isSunday as checkIsSunday,
  eachDayOfInterval,
  format,
  getTime,
  setHours,
  setMinutes,
  toDate,
} from 'date-fns';
import { TemplateCollection } from '../db/db';
import { SHORT_DATE_FORMAT } from './dates';

export const CURRENCY_FORMAT = {
  separator: '.',
  precision: 0,
};

export const generatePayrollHoursRows = (template: TemplateCollection) => {
  const startDate = toDate(template.start_date);
  const endDate = toDate(template.end_date);
  const daysBetween = eachDayOfInterval({ start: startDate, end: endDate });

  return daysBetween.map((date) => {
    const timestamp = getTime(date);
    const isHoliday = template.holidays.includes(timestamp);
    const shortFormatDate = format(date, SHORT_DATE_FORMAT);
    const dayOfWeek = format(date, 'EEEE');
    const isSunday = checkIsSunday(date);
    const isSaturday = checkIsSaturday(date);
    let defaultStartTime = setHours(setMinutes(date, 0), 6);
    let defaultEndTime = setHours(setMinutes(date, 0), 17);

    if (isSunday || isSaturday || isHoliday) {
      defaultStartTime = setHours(setMinutes(date, 0), 7);
      defaultEndTime = setHours(setMinutes(date, 15), 14);
    }
    return {
      timestamp,
      date,
      shortFormatDate,
      defaultStartTime,
      defaultEndTime,
      dayOfWeek,
      isSunday,
      isSaturday,
      isHoliday,
    };
  });
};

/* export const generatePayrollHoursModel = (
  hoursData: Record<string, RowState[]>,
) => {
  return hoursData.map((row) => ({
    id: timestamp,
    start_time: fromDateToTimestamp(row.startTime),
    end_time: fromDateToTimestamp(row.endTime),
    first_brake: row.first_break,
    second_brake: row.second_break,
  }));
}; */
