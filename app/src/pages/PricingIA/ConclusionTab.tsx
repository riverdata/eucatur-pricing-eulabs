
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Service } from "@utils/entities";
import CustomSeatsAccordion from "@components/CustomSeatsAccordion";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

export default function ConclusionTab() {
  const {
    getValues,
    setValue,
  } = useFormContext();

  const [selectedConclusion, setSelectedConclusion] = useState<any>();

  useEffect(() => {

    const fetchData = async () => {

      const purchaseDatesFromForm = getValues("conclusion.purchaseDates") || [];

      const parsedpurchaseDates = purchaseDatesFromForm.map((period: any) => ({
        ...period,
        startDate: dayjs(period.startDate),
        endDate: dayjs(period.endDate),
      }));
      setValue("conclusion.purchaseDates", parsedpurchaseDates)
      setSelectedConclusion(getValues("conclusion"));
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ width: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

      <Typography id="conclusion-tab__title" variant="subtitle1">
        Resumo
      </Typography>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
          <Typography id="conclusion-tab__description_label" variant="body1">
            <strong>Descrição</strong>
          </Typography>
          <Typography id="conclusion-tab__description" variant="body1">
            {selectedConclusion?.description && selectedConclusion.description}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography id="conclusion-tab__frequencies_label" variant="body1">
            <strong>Frequência de Vendas</strong>
          </Typography>

          {selectedConclusion?.purchaseDates.length > 0 && selectedConclusion.purchaseDates.map((item: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography id={`conclusion-tab__frequencies_days-${index}`} variant="body1">
                {item.days.map((day: any) => day.name).join(' - ')}
              </Typography>
              <Typography id={`conclusion-tab__frequencies_date-${index}`} variant="body1" sx={{ mb: 2 }}>{item?.startDate.format("DD/MM/YYYY")} - {item?.endDate.format("DD/MM/YYYY")}</Typography>
            </Box>
          ))}

        </Box>

      </Box>
      {selectedConclusion?.calculationIA.line &&
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography id={`conclusion-tab__lines_label`} variant="body1">
            <strong>Linha</strong>
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '70%' }}>
            <Typography id={`conclusion-tab__lines_description`} variant="body1" >
              {selectedConclusion?.calculationIA.line.description}
            </Typography>
            <Typography id={`conclusion-tab__lines_direction`} variant="body1">Sentido: {selectedConclusion?.calculationIA.line.direction?.description}</Typography>
          </Box>
        </Box>
      }

      {selectedConclusion?.servicesEnd.length > 0 &&
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography id={`conclusion-tab__travel_label`} variant="body1">
            <strong>Itinerários</strong>
          </Typography>
          {selectedConclusion.servicesEnd.map((item: Service, index: number) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '70%', mb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Typography id={`conclusion-tab__itineraries_origin-${index}`} variant="body1" >
                  {item?.price.description}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Typography id={`conclusion-tab__travel_direction-${index}`} variant="body1">
                  Sentido: {item?.service_direction}
                </Typography>
                <Typography id={`conclusion-tab__travel_date-${index}`} variant="body1">
                  Data: {item?.service_departure_date}
                </Typography>
                <Typography id={`conclusion-tab__travel_time-${index}`} variant="body1">
                  Horário: {item?.service_departure_time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      }

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography id={`conclusion-tab__optionalDetails_label`} variant="body1">
          <strong>Opcionais</strong>
        </Typography>

        {selectedConclusion?.optionalDetails.categories.length > 0 &&
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography id={`conclusion-tab__categories_label`} variant="body1">
              <strong>Categorias</strong>
            </Typography>
            <Typography id={`conclusion-tab__categories`} variant="body1">
              {selectedConclusion.optionalDetails.categories.map((item: any) => item.description).join(', ')}
            </Typography>
          </Box>
        }

        {selectedConclusion?.optionalDetails.agencies.length > 0 &&
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography id={`conclusion-tab__agencies_label`} variant="body1">
              <strong>Agências</strong>
            </Typography>
            <Typography id={`conclusion-tab__agencies`} variant="body1">
              {selectedConclusion.optionalDetails.agencies.map((item: any) => item.description).join(', ')}
            </Typography>
          </Box>
        }
        {selectedConclusion?.servicesEnd.length > 0 &&
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography id={`conclusion-tab__seats_label`} variant="body1">
              <strong>Poltronas</strong>
            </Typography>
            <CustomSeatsAccordion id={`conclusion-tab__seats`} services={selectedConclusion.servicesEnd} seatUpdate={false} />
          </Box>
        }
      </Box>
    </Box>
  );
}
