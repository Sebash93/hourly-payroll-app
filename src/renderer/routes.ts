export enum ROUTES {
  ROOT,
  PAYROLL,
  DOCUMENTS,
}

export const RoutePath = {
  [ROUTES.ROOT]: '/',
  [ROUTES.PAYROLL]: '/payroll/:templateId',
  [ROUTES.DOCUMENTS]: '/payroll/documents/:templateId',
};

export const getPath = (route: ROUTES, templateId: string) => {
  const path = RoutePath[route];
  return path.replace(':templateId', templateId);
};
