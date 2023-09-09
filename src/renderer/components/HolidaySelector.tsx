import {
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import EventIcon from '@mui/icons-material/Event';
import { useEffect, useState } from 'react';
import {
  fromDateToTimestamp,
  fromTimestampToHumanDate,
} from 'renderer/utils/dates';
import ClearIcon from '@mui/icons-material/Clear';

function HolidayItem({
  date,
  onDelete,
}: {
  date: number; // timestamp
  onDelete: () => void;
}) {
  const humanDate = fromTimestampToHumanDate(date);
  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={onDelete}>
          <ClearIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary={humanDate} />
    </ListItem>
  );
}

interface HolidaySelectorProps {
  onChange: (holidays: number[]) => void;
}

export default function HolidaySelector({ onChange }: HolidaySelectorProps) {
  const [holidays, setHolidays] = useState<number[]>([]);

  useEffect(() => {
    onChange(holidays);
  }, [holidays]);

  function deleteHoliday(date: number) {
    setHolidays((prev) => prev.filter((holiday) => holiday !== date));
  }

  function handleChange(date: Date | null) {
    if (date instanceof Date) {
      const timestamp = fromDateToTimestamp(date);
      const dateExists = holidays.includes(timestamp);
      if (!dateExists) {
        setHolidays((prev) => [...prev, timestamp]);
      }
    }
  }

  return (
    <>
      {!holidays || !holidays.length ? (
        <Alert sx={{ mb: 2 }} severity="info">
          Se guardará la planilla sin festivos
        </Alert>
      ) : (
        <>
          <List dense sx={{ width: '320px' }}>
            {holidays?.map((holiday) => (
              <HolidayItem
                key={holiday}
                date={holiday}
                onDelete={() => deleteHoliday(holiday)}
              />
            ))}
          </List>
          <Alert sx={{ mb: 2 }} severity="success">
            Agrega mas festivos cambiando la fecha
          </Alert>
        </>
      )}

      <DatePicker
        defaultValue={null}
        label="Agrega un dia festivo"
        onChange={(date: Date | null) => handleChange(date)}
      />
    </>
  );
}
