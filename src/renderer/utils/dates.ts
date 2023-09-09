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
