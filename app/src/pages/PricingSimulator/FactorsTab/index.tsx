import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Box, Collapse, Typography, IconButton, TableContainer, Paper, TableHead, Table, TableRow, TableBody, TableCell } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CreateOrUpdateModal from "./CreateOrUpdate";
import { toast } from "react-toastify";
import { useFetchFactors } from "@hooks/useFetchFactors";
import { IFactorAddIA, Price, Service } from "@utils/entities";


const formatHoraCompra = (hora: number): string => {
  return ` ${hora} Hora${hora === 1 ? '' : 's'}`;
};

const formattedCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const tableLabel = ['Data da Viagem', 'Horário da Viagem', 'Sentido', 'Horário da Compra', 'Dias de Antecedência', 'Tarifa Base', 'Editar']

export default function FactorsTab() {

  const {
    setValue,
    getValues,
    watch
  } = useFormContext();

  const [data, setData] = useState<Service[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<{
    serviceId: string,
    editingPriceIndex: number,
    editingPrice: Price
  }>();
  const { calculation } = useFetchFactors();
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const watchedServicesEnd = watch("conclusion.servicesEnd");

  useEffect(() => {
    setData(watchedServicesEnd || []);
  }, [watchedServicesEnd]);


  const handleToggleRow = (id: number) => {
    setOpenRowId(prev => (prev === id ? null : id));
  };

  const handleUpdate = async (serviceId: string, index: number, price: Price) => {
    const serviceToUpdate = data.find(service => service.id === serviceId);
    if (!serviceToUpdate) {
      toast.error("Serviço não encontrado");
      return;
    }

    setSelectedData({
      serviceId: serviceId,
      editingPriceIndex: index,
      editingPrice: price
    });
    setShowCreateModal(true);
  };

  const handleAddOrUpdate = async (serviceId: string, index: number, price: Price) => {

    try {

      const serviceToUpdate = data.find(service => service.id === serviceId);
      if (!serviceToUpdate) {
        toast.error("Serviço não encontrado");
        return;
      }

      const updatedPriceEnd = serviceToUpdate.priceEnd.map((priceEnd, i) =>
        i === index ? price : priceEnd
      );

      const updatedService = { ...serviceToUpdate, priceEnd: updatedPriceEnd };


      const updatedData = data.map(service =>
        service.id === serviceId ? updatedService : service
      );

      const { calculated } = await calculation(updatedData);

      setData(calculated)
      setValue("conclusion.servicesEnd", calculated)
      setShowCreateModal(false);

    } catch (error) {
      toast.error(error);
    }
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
          <Box sx={{
            paddingTop: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <span id="factors-tab__description-info"><strong>Informações Adicionais</strong></span>
            <span id="factors-tab__description-line"><strong>Linha:</strong> {getValues(`conclusion.line.description`) || '—'}</span>
            <span id="factors-tab__description-itineraries"><strong>Itinerários:</strong> {getValues(`conclusion.origin.description`) || '—'} X {getValues(`conclusion.destination.description`) || '—'}</span>
          </Box>
        </Box>
      </Box>
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
            {data.map((service: Service) => (
              service.priceEnd.map((price: Price, index: number) => {
                const isOpen = openRowId === index;
                return (
                  <React.Fragment key={index}>
                    <TableRow hover onClick={() => handleToggleRow(index)}>
                      <TableCell id={`factors-tab__list_date-${index}`}>{service?.service_departure_date}</TableCell>
                      <TableCell id={`factors-tab__list_time-${index}`}>{service?.service_departure_time}</TableCell>
                      <TableCell id={`factors-tab__list_direction-${index}`}>{(service?.service_direction).trim()}</TableCell>
                      <TableCell id={`factors-tab__list_forescast-${index}`}>{(formatHoraCompra(price.precision.hora_compra))}</TableCell>
                      <TableCell id={`factors-tab__list_days-${index}`}>{(` ${price.precision.dias_antecedencia} Dia(s)`)}</TableCell>
                      <TableCell id={`factors-tab__list_tariff-${index}`}>{formattedCurrency.format(price.precision.tarifa_base)}</TableCell>
                      <TableCell id={`factors-tab__list_actions-${index}`}>
                        <IconButton id={`factors-tab__button_update-${index}`} onClick={() => handleUpdate(service.id, index, price)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box margin={2}>
                            <Typography id={`factors-tab__list_details-${index}`} variant="subtitle2" gutterBottom>Detalhes:</Typography>
                            <TableContainer component={Paper} sx={{ display: 'flex' }} key={`factors-tab__list_${index}-table`}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell id={`factors-tab__list_title_type_label-${index}`}>Tipo de Poltrona</TableCell>
                                    <TableCell id={`factors-tab__list_price_label-${index}`}>Preço (R$)</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody sx={{ mt: '2em', alignItems: 'right', whiteSpace: 'nowrap' }}>
                                  {price.factors[1].factor_weight_add.map((item: IFactorAddIA, index2: number) => (
                                    <TableRow key={index2}>
                                      <TableCell id={`factors-tab__list_title_type-${index}_${index2}`}>{item.type}</TableCell>
                                      <TableCell id={`factors-tab__list_title_price-${index}_${index2}`}>{formattedCurrency.format(item.value)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )
              })
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateOrUpdateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleAddOrUpdate}
        dataUpdate={selectedData}
      />
    </Box >
  );
};

