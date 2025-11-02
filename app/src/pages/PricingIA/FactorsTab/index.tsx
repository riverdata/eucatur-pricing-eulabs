import { useState, useEffect } from "react";
import {
  Box, Typography, IconButton, TableContainer, Paper,
  TableHead, Table, TableRow, TableBody, TableCell,
  TablePagination, Button, ButtonGroup
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateOrUpdateModal from "./CreateOrUpdate";
import { useFormContext } from "react-hook-form";
import { Price, Service } from "@utils/entities";
import { toast } from "react-toastify";
import { useFetchFactors } from "@hooks/useFetchFactors";

// Função auxiliar para gerar os botões de página
function getPageNumbers(currentPage: number, totalPages: number, maxButtons: number = 5): number[] {
  let start = Math.max(0, currentPage - Math.floor(maxButtons / 2));
  let end = start + maxButtons;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(0, end - maxButtons);
  }

  const pages = [];
  for (let i = start; i < end; i++) {
    pages.push(i);
  }
  return pages;
}

export default function FactorsTab() {
  const { setValue, getValues } = useFormContext();
  const [data, setData] = useState<Service[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<{
    serviceId: string,
    editingPriceIndex: number,
    editingPrice: Price
  }>();
  const { calculation } = useFetchFactors();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const flattenedRows = data.flatMap((service, serviceIndex) =>
    service.priceEnd.map((price, priceIndex) => ({
      service,
      price,
      serviceIndex,
      priceIndex,
    }))
  );

  const paginatedRows = flattenedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(flattenedRows.length / rowsPerPage);

  useEffect(() => {
    const servicesEnd = getValues("conclusion.servicesEnd") || [];
    setData(servicesEnd);
    setPage(0);
  }, []);

  const handleRemove = async (serviceId: string, priceIndex: number) => {
    const serviceToUpdate = data.find(service => service.id === serviceId);
    if (!serviceToUpdate) {
      toast.error("Serviço não encontrado");
      return;
    }
    const updatedPriceEnd = serviceToUpdate.priceEnd.filter((_, i) => i !== priceIndex);
    const updatedService = { ...serviceToUpdate, priceEnd: updatedPriceEnd };
    const updatedData = data.map(service =>
      service.id === serviceId ? updatedService : service
    );
    setData(updatedData);
    setValue("conclusion.servicesEnd", updatedData);
    setPage(0);
  };

  const handleUpdate = (serviceId: string, priceIndex: number, price: Price) => {
    setSelectedData({
      serviceId,
      editingPriceIndex: priceIndex,
      editingPrice: price,
    });
    setShowCreateModal(true);
  };

  const handleAddOrUpdate = async (serviceId: string, priceIndex: number, price: Price) => {
    try {
      const serviceToUpdate = data.find(service => service.id === serviceId);
      if (!serviceToUpdate) {
        toast.error("Serviço não encontrado");
        return;
      }
      const updatedPriceEnd = serviceToUpdate.priceEnd.map((p, i) => i === priceIndex ? price : p);
      const updatedService = { ...serviceToUpdate, priceEnd: updatedPriceEnd };
      const updatedData = data.map(service =>
        service.id === serviceId ? updatedService : service
      );
      const { calculated } = await calculation(updatedData);
      setData(calculated);
      setValue("conclusion.servicesEnd", calculated);
      setShowCreateModal(false);
      setPage(0);
    } catch (error) {
      toast.error("Erro ao atualizar os dados");
    }
  };

  const formatHoraCompra = (hora: number): string => {
    return ` ${hora} Hora${hora === 1 ? '' : 's'}`;
  };

  const tableLabel = ['Dados da Viagem', 'Origem e Destino', 'Horário da Compra', 'Dias de Antecedência', 'Opções'];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box id="factors-tab">
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 2,
          mb: 2
        }}
      >
        <Box
          id="factors-tab__description"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'text.primary'
          }}
        >
          <span id="factors-tab__description-section">Seção destinada à revisão e edição dos preços das poltronas sugeridos pela Inteligência Artificial.</span>
          <Box sx={{ paddingTop: 1, display: 'flex', flexDirection: 'column' }}>
            <span id="factors-tab__description-info"><strong>Informações Adicionais</strong></span>
            <span id="factors-tab__description-line"><strong>Linha:</strong> {getValues(`conclusion.calculationIA.line.description`) || '—'}</span>
          </Box>
        </Box>
      </Box>

      {data.length === 0 ? (
        <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          Não há dados disponíveis
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {tableLabel.map((item: string, index: number) => (
                    <TableCell id={`factors-tab__list_label-${index}`} key={index}><strong>{item}</strong></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ mt: '2em', alignItems: 'right', whiteSpace: 'nowrap' }}>
                {paginatedRows.map(({ service, price, serviceIndex, priceIndex }, index) => (
                  <TableRow key={`${service.id}-${priceIndex}`}>
                    <TableCell id={`factors-tab__list_date-${index}`}>{service?.description}</TableCell>
                    <TableCell id={`factors-tab__list_routes-${index}`}>{service?.price.description}</TableCell>
                    <TableCell id={`factors-tab__list_forescast-${index}`}>{formatHoraCompra(price.precision.hora_compra)}</TableCell>
                    <TableCell id={`factors-tab__list_days-${index}`}>{`${price.precision.dias_antecedencia} Dia(s)`}</TableCell>
                    <TableCell id={`factors-tab__list_actions-${index}`}>
                      <IconButton id={`factors-tab__button-update-${index}`} onClick={() => handleUpdate(service.id, priceIndex, price)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" id={`factors-tab__button-delete-${index}`} onClick={() => handleRemove(service.id, priceIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
            <TablePagination
              component="div"
              count={flattenedRows.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Serviços por página"
              showFirstButton
              showLastButton
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <ButtonGroup variant="outlined" size="small" aria-label="pagination">
                {getPageNumbers(page, totalPages).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'contained' : 'outlined'}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
          </Box>



        </>
      )}

      <CreateOrUpdateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleAddOrUpdate}
        dataUpdate={selectedData}
      />
    </Box>
  );
}
