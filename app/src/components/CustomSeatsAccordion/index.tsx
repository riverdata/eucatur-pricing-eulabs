import { FC, useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid2,
  Typography,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Table,
  TableHead
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Price, Seats, Service } from '@utils/entities';
import CustomSeats from '@components/CustomSeats';
import CreateOrUpdateModal from './CreateOrUpdate';
import { useFormContext } from "react-hook-form";
import PageLoader from '@components/PageLoader';

interface CustomSeatsProps {
  id: string;
  services: Service[];
  seatUpdate: boolean;
  view?: boolean;
}

const CustomSeatsAccordion: FC<CustomSeatsProps> = ({
  id,
  services,
  seatUpdate = false,
  view = true
}) => {
  const { setValue } = useFormContext();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedData, setSelectedData] = useState<{ service: Service; indice: number; seat: Seats }>();
  const [dataService, setDataService] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (services?.length) {
      setDataService(services);
      setIsLoading(false);
    }
  }, [services]);

  const handleUpdate = (service: Service, indice: number, newValue: Seats) => {
    setSelectedData({ service, indice, seat: newValue });
    setShowCreateModal(true);
  };

  const handleAddOrUpdate = (service: Service, indice: number, newValue: Seats) => {
    const updatedData = dataService.map((serv) => {
      if (
        serv.id === service.id &&
        serv.description === service.description
      ) {
        const updatedPriceEnd = (serv.priceEnd || []).map((price, idx) => {
          if (idx !== indice) return price;

          const updatedSeats = JSON.parse(JSON.stringify(price.seats || [[], []]));
          updatedSeats[newValue.floor][newValue.subArray] = updatedSeats[newValue.floor][newValue.subArray].map(
            (item: Seats) => (item.id === newValue.id ? newValue : item)
          );

          return { ...price, seats: updatedSeats };
        });

        return { ...serv, priceEnd: updatedPriceEnd };
      }

      return serv;
    });

    setDataService(updatedData);
    setValue("conclusion.servicesEnd", updatedData);
    setShowCreateModal(false);
  };


  const formattedCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  if (isLoading) {
    return (
      <Box
        id={`${id}_loading`}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: 4 }}
      >
        <PageLoader />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Carregando dados das viagens...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {dataService.map((service, index) => (
        <Box sx={{ width: "100%", marginTop: '1em' }} key={index} id={`${id}_${index}`}>
          <Grid2 container spacing={2} sx={{ mb: 2 }}>
            <Grid2>
              <Box fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                Itinerário
                <Chip
                  label={service.price.description}
                  size="small"
                  sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#6E7079', borderRadius: '5px', fontSize: '14px' }}
                />
              </Box>
            </Grid2>
            <Grid2>
              <Box fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                Categoria
                <Chip
                  label={service.price.class_description}
                  size="small"
                  sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#6E7079', borderRadius: '5px', fontSize: '14px' }}
                />
              </Box>
            </Grid2>
            <Grid2>
              <Box fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                Horário
                <Chip
                  label={service.service_departure_time}
                  size="small"
                  sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#6E7079', borderRadius: '5px', fontSize: '14px' }}
                />
              </Box>
            </Grid2>
            <Grid2>
              <Box fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                Data
                <Chip
                  label={service.service_departure_date}
                  size="small"
                  sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#6E7079', borderRadius: '5px', fontSize: '14px' }}
                />
              </Box>
            </Grid2>
          </Grid2>

          {(service.priceEnd ?? [null]).map((price, index2) => (
            <Accordion key={index2} id={`${id}_${index2}_accordion`}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {price ? (
                  <Grid2 container spacing={2}>
                    <Grid2>
                      Horário da compra: {price.precision.hora_compra} Hora(s)
                    </Grid2>
                    <Grid2>
                      Dias de Antecedência: {price.precision.dias_antecedencia} Dia(s)
                    </Grid2>
                    <Grid2>
                      Tarifa Base: {formattedCurrency.format(price.precision.tarifa_base)}
                    </Grid2>
                  </Grid2>
                ) : (
                  <Chip label={`QDD Poltronas: ${service.service_seats}`} />
                )}
              </AccordionSummary>

              <AccordionDetails>
                {price && price.factors?.[1] && (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Tipo de Poltrona</TableCell>
                          <TableCell>Preço (R$)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {price.factors[1].factor_weight_add.map((item: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{formattedCurrency.format(item.value)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {view && (
                  <CustomSeats
                    key={`${service.id}_${index2}_CustomSeats`}
                    id={`${id}_${index2}_CustomSeats`}
                    service={service}
                    indice={seatUpdate ? index2 : null}
                    data={seatUpdate ? price?.seats : price?.seatsEnd}
                    seatUpdate={seatUpdate}
                    {...(seatUpdate && { handleUpdate })}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}

      <CreateOrUpdateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleAddOrUpdate}
        dataUpdate={selectedData}
      />
    </>
  );
};

export default CustomSeatsAccordion;
