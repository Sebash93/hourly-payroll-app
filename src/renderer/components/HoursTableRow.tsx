import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TableCell,
  TableRow,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import { hoursWithoutBreaks } from 'renderer/utils/dates';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const DISABLED_COLOR = 'rgb(0 0 0 / 38%)';

interface RowState {
  startTime?: Date;
  endTime?: Date;
  first_break?: boolean;
  second_break?: boolean;
}

export interface RowData {
  timestamp: number;
  shortFormatDate: string;
  defaultStartTime: Date;
  defaultEndTime: Date;
  dayOfWeek: string;
  isHoliday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
}

interface HoursTableRowProps {
  rowData: RowData;
  onHoursChange: (hours: number) => void;
}

export default function HoursTableRow({
  rowData,
  onHoursChange,
}: HoursTableRowProps) {
  const {
    timestamp,
    shortFormatDate,
    defaultStartTime,
    defaultEndTime,
    dayOfWeek,
    isHoliday,
    isSunday,
    isSaturday,
  } = rowData;

  const initialRowState = {
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    first_break: true,
    second_break: !isHoliday && !isSunday && !isSaturday,
  };

  const [rowState, setRowState] = useState<RowState>(initialRowState);
  const [isDiabled, setIsDisabled] = useState(false);
  const [totalHours, setTotalHours] = useState(0);
  const rowStyle = {
    '&:last-child td, &:last-child th': { border: 0 },
    backgroundColor:
      isHoliday || isSunday ? '#cfd8dc' : isSaturday ? '#eceff1' : 'white',
  };

  useEffect(() => {
    try {
      if (!rowState.startTime || !rowState.endTime) {
        return setTotalHours(0);
      }
      const hours = hoursWithoutBreaks(
        { startTime: rowState.startTime, endTime: rowState.endTime },
        {
          firstBreak: rowState.first_break,
          secondBreak: rowState.second_break,
        }
      );
      setTotalHours(hours);
    } catch (error) {
      setTotalHours(0);
    }
  }, [rowState]);

  useEffect(() => {
    console.log({ totalHours });
    onHoursChange(totalHours);
  }, [totalHours]);

  const handleChange = (propertyKey: string, value: any) => {
    setRowState({ ...rowState, [propertyKey]: value });
  };

  const handleDisableChange = (event) => {
    const {
      target: { checked },
    } = event;
    if (checked) {
      setRowState({});
    } else {
      setRowState(initialRowState);
    }
    setIsDisabled(event.target.checked);
  };

  return (
    <TableRow sx={rowStyle}>
      <TableCell>
        <Checkbox onChange={handleDisableChange} />
      </TableCell>
      <TableCell sx={{ color: isDiabled ? DISABLED_COLOR : 'inherit' }}>
        {shortFormatDate}
      </TableCell>
      <TableCell sx={{ color: isDiabled ? DISABLED_COLOR : 'inherit' }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {dayOfWeek}
          {isHoliday && <WbSunnyIcon fontSize="small" />}
        </span>
      </TableCell>
      <TableCell>
        <TimePicker
          label="Entrada"
          value={rowState.startTime || defaultStartTime}
          sx={{ maxWidth: '170px' }}
          disabled={isDiabled}
          slotProps={{ textField: { size: 'small' } }}
          onChange={(date) => handleChange('startTime', date)}
        />
      </TableCell>
      <TableCell>
        <TimePicker
          label="Salida"
          value={rowState.endTime || defaultEndTime}
          sx={{ maxWidth: '170px' }}
          disabled={isDiabled}
          slotProps={{ textField: { size: 'small' } }}
          onChange={(date) => handleChange('endTime', date)}
        />
      </TableCell>
      <TableCell>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) =>
                  handleChange('first_break', event.target.checked)
                }
                checked={rowState.first_break || false}
              />
            }
            label="Desayuno"
            disabled={isDiabled}
          />
          <FormControlLabel
            disabled={isDiabled}
            control={
              <Checkbox
                checked={rowState.second_break || false}
                onChange={(event) =>
                  handleChange('second_break', event.target.checked)
                }
              />
            }
            label="Almuerzo"
          />
        </FormGroup>
      </TableCell>
      <TableCell>{totalHours}</TableCell>
    </TableRow>
  );
}
