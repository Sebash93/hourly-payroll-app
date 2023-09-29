const Routes = {
  root: '/',
  payroll: 'payroll/:templateId',
  documents: 'payroll/documents/:templateId',
};

export const getRoute = (route: string, templateId: string) => {
  return route.replace(':templateId', templateId);
};

export default Routes;
