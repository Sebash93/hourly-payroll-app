/* eslint-disable prefer-destructuring */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import HoursTableRow, { RowData } from './HoursTableRow';

interface HoursTableProps {
  rows: RowData[];
  onTotalHoursChange: ({
    common,
    holiday,
  }: {
    common: number;
    holiday: number;
  }) => void;
}

interface HoursData {
  hours: number;
  isHolidayRate: boolean;
}

export default function HoursTable({
  rows,
  onTotalHoursChange,
}: HoursTableProps) {
  const [hoursData, setHoursData] = useState<Record<string, HoursData>>({});

  const handleOnHoursChange = (
    id: number,
    hours: number,
    isHolidayRate: boolean
  ) => {
    setHoursData((prev) => {
      return { ...prev, [id]: { hours, isHolidayRate } };
    });
  };

  const handleCalculateClick = () => {
    let common = 0;
    let holiday = 0;
    Object.keys(hoursData).forEach((key) => {
      const hours = hoursData[key].hours;
      if (hoursData[key].isHolidayRate) {
        holiday += hours;
      } else {
        common += hours;
      }
    });
    onTotalHoursChange({ common, holiday });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            Planilla de horas
            <Button
              variant="contained"
              endIcon={<CalculateOutlinedIcon />}
              onClick={handleCalculateClick}
            >
              Calcular
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No Laboral</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Día</TableCell>
              <TableCell>Hora Entrada</TableCell>
              <TableCell>Hora Salida</TableCell>
              <TableCell>Descanso</TableCell>
              <TableCell>T. Horas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <HoursTableRow
                key={row.timestamp}
                rowData={row}
                onHoursChange={(hours) =>
                  handleOnHoursChange(
                    row.timestamp,
                    hours,
                    row.isHoliday || row.isSunday
                  )
                }
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
