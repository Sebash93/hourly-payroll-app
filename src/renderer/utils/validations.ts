export const noEmptyArray = (value: any[]) => {
  if (!value.length) return 'Debes seleccionar al menos un empleado';
  return true;
};
