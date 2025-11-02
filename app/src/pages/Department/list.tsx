import RootLayout from "@components/Layout";
import { useNavigate } from "react-router-dom";
import { Department } from "@utils/entities";
import PageLoader from "@components/PageLoader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableContainer, Paper, Table, TableCell, TableBody, TableHead, TableRow, IconButton, Button, Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DepartmentService } from "@utils/services/api/department";
import DomainAddRoundedIcon from '@mui/icons-material/DomainAddRounded';

export default function DepartmentListScreen() {
  const [data, setData] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await DepartmentService.list();

        setData(data.data);
        setIsLoading(false);
        toast.success(data.message);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    };
    fetchData();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      setIsLoading(true);
      await DepartmentService.delete(id);
      const data = await DepartmentService.list();
      setData(data.data);
      setIsLoading(false);
      toast.success(`Departamento deletado com sucesso.`);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <RootLayout>
      {isLoading ? (
        <PageLoader id="DepartmentListScreen_PageLoader" />
      ) : (
        <Box id="DepartmentListScreen" sx={{ display: 'flex', width: '100%', gap: '2em', flexDirection: 'column' }}>
          <Typography id="DepartmentListScreen_title" variant="subtitle1">
            Departamentos
          </Typography>
          <Button
            id={`DepartmentListScreen_button_create`}
            color="primary"
            onClick={() => navigate(`/department/create`, { replace: true })}
            sx={{ gap: '1em', alignSelf: 'self-end' }}
          >
            Novo Departamento <DomainAddRoundedIcon />
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell id={`DepartmentListScreen_description`}><strong>Descrição</strong></TableCell>
                  <TableCell id={`DepartmentListScreen_manager`}><strong>Gestor</strong></TableCell>
                  <TableCell id={`DepartmentListScreen_actions`}><strong>Ação</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ mt: '2em', alignItems: 'right', whiteSpace: 'nowrap' }}>
                {data.map((department: Department, index: number) => (
                  <TableRow key={index}>
                    <TableCell id={`DepartmentListScreen_description_${index}`}>{department.description}</TableCell>
                    <TableCell id={`DepartmentListScreen_manager_${index}`}>{department.manager?.name}</TableCell>
                    <TableCell id={`DepartmentListScreen_actions_${index}`}>
                      <IconButton
                        id={`DepartmentListScreen_button_edit`}
                        color="primary"
                        onClick={() => navigate(`/department/${department.id}/edit`, { replace: true })}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        id={`DepartmentListScreen_button_remove`}
                        color="error"
                        onClick={() => handleRemove(department.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Box>
      )}
    </RootLayout>
  );
}
