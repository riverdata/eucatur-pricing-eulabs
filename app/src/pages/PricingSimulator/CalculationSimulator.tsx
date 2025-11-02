import {
  Box,
  Typography
} from '@mui/material';
import { useFormContext } from "react-hook-form";
import CustomSeatsAccordion from '@components/CustomSeatsAccordion';

export default function CalculationSimulator() {

  const {
    watch,
    getValues
  } = useFormContext();

  const servicesEnd = watch("conclusion.servicesEnd");

  return (
    <div id="calculation-simulator">
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 2,
          mb: 2
        }}
      >
        <Box
          id="calculation-simulator__description"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'text.primary'

          }}
        >
          <span id="calculation-simulator__description-section">Seção destinada à revisão dos preços das poltronas sugeridos pela Inteligência Artificial.</span>
        </Box>
      </Box>
      <Box
        sx={{
          margin: '0 auto',
          padding: '20px',
          borderRadius: '8px',
        }}>
        <Typography id="calculation-simulator__title" variant="subtitle2" gutterBottom>
          Preços previstos pela Inteligência Artifical</Typography>
        <CustomSeatsAccordion id={`calculation-simulator`} services={servicesEnd} seatUpdate={false} view={false}/>

      </Box>
    </div>
  );
}
