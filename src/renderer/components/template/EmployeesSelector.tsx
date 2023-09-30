import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { EmployeeCollection } from 'renderer/db';

interface EmployeesSelectorProps {
  employees: EmployeeCollection[];
  onChange: (employeeIds: string[]) => void;
}

export default function EmployeesSelector({
  employees,
  onChange,
}: EmployeesSelectorProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Set initial checked items
  useEffect(() => {
    const initialCheckedItems = employees.reduce(
      (acc, { id, checkedByDefault }) => ({
        ...acc,
        [id]: checkedByDefault,
      }),
      {}
    );
    setCheckedItems(initialCheckedItems);
  }, []);

  // Check if new employee is added and add it to checked items
  useEffect(() => {
    const newEmployee = employees.find(
      ({ id }) => !Object.keys(checkedItems).includes(id)
    );
    if (newEmployee) {
      setCheckedItems((prevCheckedItems) => ({
        ...prevCheckedItems,
        [newEmployee.id]: newEmployee.checkedByDefault,
      }));
    }
  }, [employees]);

  useEffect(() => {
    onChange(Object.keys(checkedItems).filter((key) => checkedItems[key]));
  }, [checkedItems]);

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    const { id, checked } = event.target;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [id]: checked,
    }));
  }

  return (
    <FormGroup
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
      }}
    >
      {employees?.length
        ? employees.map(({ name, id, checkedByDefault }) => (
            <FormControlLabel
              key={id}
              control={
                <Checkbox
                  id={id}
                  defaultChecked={checkedByDefault}
                  onChange={(e) => handleCheckboxChange(e)}
                />
              }
              label={name}
            />
          ))
        : null}
    </FormGroup>
  );
}
