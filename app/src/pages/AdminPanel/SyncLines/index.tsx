import { useState, FC } from "react";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Line } from "@utils/entities";
import { LineService } from "@utils/services/api/line";
import { toast } from "react-toastify";
import PageLoader from "@components/PageLoader";


const SyncLines: FC = () => {
    const [dataLines, setDataLines] = useState<Line[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dataComIntl = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeZone: 'America/Sao_paulo',
    });

    const timeComIntl = new Intl.DateTimeFormat('pt-BR', {
        timeStyle: 'short',
        timeZone: 'America/Sao_paulo',
    });

    const fetchLines = async () => {
        try {
            setIsLoading(true);
            const data = await LineService.sync();
            setDataLines(data.data);
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
                    Novas Linhas
                </Typography>
                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={fetchLines}
                >
                    Sincronizar todas as linhas
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Index</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Linha</TableCell>
                            <TableCell>Km Total</TableCell>
                            <TableCell>Data Criação</TableCell>
                            <TableCell>Data Atualização</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ mt: '2em', alignItems: 'right', whiteSpace: 'nowrap' }}>
                        {isLoading ? <PageLoader /> : dataLines.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.line_code}</TableCell>
                                <TableCell>{item.line_total_km}</TableCell>
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

export default SyncLines;




