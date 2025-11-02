import { useState, FC } from "react";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Agency } from "@utils/entities";
import { AgencyService } from "@utils/services/api/agency";
import PageLoader from "@components/PageLoader";
import { toast } from "react-toastify";


const SyncAgency: FC = () => {
    const [dataData, setData] = useState<Agency[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dataComIntl = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeZone: 'America/Sao_paulo',
    });

    const timeComIntl = new Intl.DateTimeFormat('pt-BR', {
        timeStyle: 'short',
        timeZone: 'America/Sao_paulo',
    });

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await AgencyService.sync();
            setData(data.data);
            toast.success("Dados sincronizados!");
        } catch (error) {
            toast.error("Erro ao sincronizar os dados!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    margin: "16px 0",
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>

                <Typography id="SignInScreen_title" variant="subtitle2" gutterBottom>
                    Novas Agências
                </Typography>
                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={fetchData}
                >
                    Sincronizar todas as agências
                </Button>
            </Box>


            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Index</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Data Criação</TableCell>
                            <TableCell>Data Atualização</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ mt: '2em', alignItems: 'right', whiteSpace: 'nowrap' }}>
                        {isLoading ? <PageLoader /> :
                            dataData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{dataComIntl.format(new Date(item.createdAt))} ás {timeComIntl.format(new Date(item.createdAt))}</TableCell>
                                    <TableCell>{dataComIntl.format(new Date(item.updatedAt))} ás {timeComIntl.format(new Date(item.updatedAt))}</TableCell>
                                </TableRow>
                            ))}

                    </TableBody>
                </Table>
            </TableContainer>

        </>
    );
}

export default SyncAgency;




