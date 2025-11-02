import RootLayout from "@components/Layout";
import { useNavigate } from "react-router-dom";
import { User } from "@utils/entities";
import { UserService } from "@utils/services/api/user";
import PageLoader from "@components/PageLoader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableContainer, Paper, Table, TableCell, TableBody, TableHead, TableRow, IconButton, Button, Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function UserListScreen() {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const users = await UserService.getAll();
        setData(users);
        setIsLoading(false);
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
      await UserService.delete(id);
      const users = await UserService.getAll();
      setData(users);
      setIsLoading(false);
      toast.success(`Usuário deletado com sucesso.`);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handleDisable = async (id: string, statusText: string) => {
    try {
      setIsLoading(true);
      const status = statusText === 'Ativo' ? 'inactive' : 'active';
      await UserService.createOrUpdate({ id, status });
      const users = await UserService.getAll();
      setData(users);
      setIsLoading(false);
      toast.success(`Usuário ${status === 'active' ? 'ativado' : 'desativado'} com sucesso.`);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <RootLayout>
      {isLoading ? (
        <PageLoader />
      ) : (
        <Box id="UserListScreen" sx={{ display: 'flex', width: '100%', gap: '2em', flexDirection: 'column' }}>
          <Typography id="UserListScreen_title" variant="subtitle1">
            Usuários
          </Typography>
          <Button
            id={`UserListScreen_button_create`}
            color="primary"
            onClick={() => navigate(`/user/create`, { replace: true })}
            sx={{ gap: '1em', alignSelf: 'self-end' }}
          >
            Novo Usuário <PersonAddIcon />
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>

                  <TableCell id={`UserListScreen_name`}><strong>Nome</strong></TableCell>
                  <TableCell id={`UserListScreen_email`}><strong>E-mail</strong></TableCell>
                  <TableCell id={`UserListScreen_status`}><strong>Status</strong></TableCell>
                  <TableCell id={`UserListScreen_permission`}><strong>Permissão</strong></TableCell>
                  <TableCell id={`UserListScreen_actions`}><strong>Ação</strong></TableCell>

                </TableRow>
              </TableHead>
              <TableBody sx={{ mt: '2em', alignItems: 'right', whiteSpace: 'nowrap' }}>
                {data.map((user: User, index: number) => (
                  <TableRow key={index}>
                    <TableCell id={`UserListScreen_name_${index}`}>{user.name}</TableCell>
                    <TableCell id={`UserListScreen_email_${index}`}>{user.email}</TableCell>
                    <TableCell id={`UserListScreen_status_${index}`}>{user.statusText}</TableCell>
                    <TableCell id={`UserListScreen_permission_${index}`}>{user.userRoleText}</TableCell>
                    <TableCell id={`UserListScreen_actions_${index}`}>

                      <IconButton
                        id={`UserListScreen_button_edit`}
                        color="primary"
                        onClick={() => navigate(`/user/${user.id}/edit`, { replace: true })}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        id={`UserListScreen_button_disable`}
                        color={user.statusText === 'Ativo' ? 'success' : 'error'}
                        onClick={() => handleDisable(user.id, user.statusText)}
                      >
                        {user.statusText === 'Ativo' ? <PersonIcon /> : <PersonOffIcon />}
                      </IconButton>
                      <IconButton
                        id={`UserListScreen_button_remove`}
                        color="error"
                        onClick={() => handleRemove(user.id)}
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
