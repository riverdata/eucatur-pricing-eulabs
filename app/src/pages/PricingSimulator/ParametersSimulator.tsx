import { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox
} from '@mui/material';
import { useFormContext } from "react-hook-form";
import SimulatorLines from './SimulatorLines';
import SimulatorItineraries from './SimulatorItineraries';
import SimulatorTime from './SimulatorTime';

import { Service } from '@utils/entities';

const formattedCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function ParametersSimulator() {
  const {
    setValue,
    watch
  } = useFormContext();

  const servicesEnd = watch("conclusion.servicesEnd") || [];
  const [selectedRows, setSelectedRows] = useState<Service[]>([]);

  const handleCheckboxChange = (row: Service, checked: boolean) => {
    setSelectedRows(prev => {
      const newSelected = checked
        ? [...prev, row]
        : prev.filter(item => item !== row);

      setValue('conclusion.selectedRows', newSelected);
      return newSelected;
    });
  };


  return (
    <div id="parameters-simulator">
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 2,
          mb: 2
        }}
      >
        <Box
          id="parameters-simulator__description"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'text.primary'

          }}
        >
          <span id="parameters-simulator__description-section">Seção destinada à edição dos parametros requeridos pela Inteligência Artificial.</span>
        </Box>
      </Box>
      <Box
        sx={{
          margin: '0 auto',
          padding: '20px',
          borderRadius: '8px',
        }}>
        <SimulatorLines />

        <SimulatorTime />

        <SimulatorItineraries />

        {servicesEnd.length > 0 && (<>
          <Typography id="parameters-simulator__title" variant="subtitle2" gutterBottom>Horários disponíveis na linha selecionada</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell id="parameters-simulator__time">Horário de saída</TableCell>
                  <TableCell id="parameters-simulator__direction">Sentido</TableCell>
                  <TableCell id="parameters-simulator__category">Categoria</TableCell>
                  <TableCell id="parameters-simulator__tariff">Tarifa Base</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ mt: '2em', whiteSpace: 'nowrap' }}>
                {servicesEnd.map((row: Service, index: number) => {
                  const isChecked = selectedRows.some(item => item.id === row.id);
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange(row, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell id={`parameters-simulator__time-${index}`}>{row.service_departure_time}</TableCell>
                      <TableCell id={`parameters-simulator__direction-${index}`}>{row.service_direction}</TableCell>
                      <TableCell id={`parameters-simulator__category-${index}`}>{row.price.class_description}</TableCell>
                      <TableCell id={`parameters-simulator__tariff-${index}`}>{formattedCurrency.format(row.price.amount)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>)}
      </Box>
    </div>
  );
}
