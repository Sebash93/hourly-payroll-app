import ArticleIcon from '@mui/icons-material/Article';
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeCard from 'renderer/components/EmployeeCard';
import PayrollHoursDialog from 'renderer/components/PayrollHoursDialog';
import { EmployeeCollection, TemplateCollection } from 'renderer/db/db';
import { useOneTemplateStore, usePayrollStore } from 'renderer/store/store';
import { SHORT_DATE_FORMAT } from 'renderer/utils/dates';

export default function PayrollPage() {
  let { templateId } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // selectedEmployee state
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCollection>(
    {}
  );

  // has payroll
  const { result: templatePayroll, isFetching: isFetchingTemplatePayroll } =
    usePayrollStore(templateId);

  // employess state
  const [employees, setEmployees] = useState<EmployeeCollection[]>([]);
  const [template, setTemplate] = useState<TemplateCollection>(null);

  // Load templates
  const { result: templates, isFetching } = useOneTemplateStore(templateId);

  // Load employees
  useEffect(() => {
    async function populateEmployees() {
      if (templates.length === 0) return;
      const templateEmployees = await templates[0].populate('employees');
      setEmployees(templateEmployees);
      setTemplate(templates[0]);
    }
    populateEmployees();
  }, [templates]);

  const handleEmployeeClick = (employee: EmployeeCollection) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  /*  template[0].populate('employees'); */
  if (isFetching || !template) return <CircularProgress />;
  return (
    <>
      <Typography variant="h4" sx={{ p: 2 }}>
        Horas
      </Typography>
      <Paper sx={{ padding: '24px' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sx={{ marginBottom: '16' }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              {format(new Date(template.start_date), SHORT_DATE_FORMAT)} al{' '}
              {format(new Date(template.end_date), SHORT_DATE_FORMAT)}
              <span>
                <Button
                  variant="contained"
                  endIcon={<ArticleIcon />}
                  disabled={!templatePayroll.length}
                  onClick={() => navigate(`/payroll/documents/${template.id}`)}
                >
                  Documentos
                </Button>
              </span>
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          {employees.map((employee) => (
            <Grid key={employee.id} item lg={3} md={4} sm={6} xs={12}>
              <EmployeeCard
                id={employee.id}
                templateId={template.id}
                name={employee.name}
                onClick={() => handleEmployeeClick(employee)}
              />
            </Grid>
          ))}
        </Grid>
        <PayrollHoursDialog
          open={open}
          handleClose={() => setOpen(false)}
          startDate={format(new Date(template.start_date), SHORT_DATE_FORMAT)}
          endDate={format(new Date(template.end_date), SHORT_DATE_FORMAT)}
          employee={selectedEmployee}
          template={templates[0]}
        />
      </Paper>
    </>
  );
}
