import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";
import { Service } from "@utils/entities";
import { toast } from 'react-toastify';
import CustomFrequencies from "@components/CustomFrequencies";
import PageLoader from "@components/PageLoader";
import { Box, Typography } from "@mui/material";
import { useMatch } from "react-router-dom";
import { useStepper } from "@providers/StepperProvider";

interface ISelectDay {
  id: string;
  name: string;
  description: string;
}

interface IFrequency {
  id: string;
  days: ISelectDay[];
  startDate: Dayjs;
  endDate: Dayjs;
}

const extrairDatasUnicas = (array: Service[]): string[] => {
  if (!array.length) return [dayjs().format('YYYY-MM-DD')];

  return Array.from(
    new Set(
      array.map(service =>
        dayjs(service.service_departure_date).format('YYYY-MM-DD')
      )
    )
  );
};


const extrairDatasUnicasCalendary = (array: Service[]) => {
  if (array.length > 0) {
      return Array.from(
          new Set(array.map((service: Service) => dayjs(service.service_departure_date).format("YYYY-MM-DD")))
      ).map(date => dayjs(date));
  }
  return [dayjs()]
};

export default function Frequencies() {
  const {
    setValue,
    getValues,
    watch
  } = useFormContext();

  const [data, setData] = useState<IFrequency[]>(getValues("conclusion.calculationIA.forecastDate"));
  const [datesReleased, setDatesReleased] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const services = watch("conclusion.services");
  const isEdit = useMatch("/precificacao/:id/edit");
  const isDuplicate = useMatch("/precificacao/:id/duplicate");
  const { setLoading } = useStepper();
  const [datasLiberadas, setDatasLiberadas] = useState<Dayjs[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const datasUnicas = extrairDatasUnicas(services);
        setDatesReleased(datasUnicas);
        const forecastDateFromForm = getValues("conclusion.calculationIA.forecastDate") || [];

        if (forecastDateFromForm.length === 0) {
          toast.warn("Antes de continuar, selecione periodos de datas com viagens disponiveis.");
          return;
        } else {
          const parsedForecastDate = forecastDateFromForm.map((period: any) => ({
            ...period,
            startDate: dayjs(period.startDate),
            endDate: dayjs(period.endDate),
          }));
          setData(parsedForecastDate);
          if (!isEdit && !isDuplicate) {
            setLoading(true);
          } else {
            setLoading(false);
          }
        }

      } catch (error) {
        toast.error("Erro ao buscar dados de viagens!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

  }, [services.length > 0]);


  const handleUpdateForm = async (updatedData: IFrequency[]) => {
    setData(updatedData);
    setValue("conclusion.calculationIA.forecastDate", updatedData);
  };

  useEffect(() => {
    const datasUnicas = extrairDatasUnicasCalendary(services);
    setDatasLiberadas(datasUnicas)
}, []);

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 2,
          mb: 2
        }}
      >
        <Typography
          id={`frequencies__description`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'text.primary'

          }}
        >
          <span id={`frequencies__description_section`}>Defina o intervalo de datas a partir do qual serão listados os horários disponíveis para, em seguida, serem utilizados na análise da IA.
          </span>
        </Typography>
      </Box>
      {isLoading ? <PageLoader id="frequencies__page-loader" /> :
        <CustomFrequencies dataFrequency={data} handleUpdateForm={handleUpdateForm} status={false} datasLiberadas={datasLiberadas} />
      }
    </>
  );
};

