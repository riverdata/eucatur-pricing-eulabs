import { useEffect, useState } from "react";
import { Line, Service } from "@utils/entities";
import { useFormContext, get } from "react-hook-form";
import CustomInput from "@components/CustomInput";
import dayjs, { Dayjs } from "dayjs";
import { Box } from "@mui/material";
import "dayjs/locale/pt-br";
import CalendarWithHolidays from "@components/CalendarWithHolidays";
import { useFetchServices } from "@hooks/useFetchServices";
import PageLoader from "@components/PageLoader";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { themeScss } from "@theme";
import { toast } from "react-toastify";
dayjs.locale("pt-br");

const daysAdvanceValidation = {
  required: "Os Dias de antecedência é obrigatório.",
  pattern: {
    value: /^(0?[1-9]|[1-2][0-9]|30)$/,
    message: "Digite um dia válido.",
  }
};

const timePurchaseValidation = {
  required: "O horário da compra é obrigatório.",
  pattern: {
    value: /^(0?[1-9]|1[0-9]|2[0-4])$/,
    message: "Digite um horário válido",
  }
};

const extrairDatasUnicas = (array: Service[]) => {
  if (array.length > 0) {
    return Array.from(
      new Set(array.map((service: Service) => dayjs(service.service_departure_date).format("YYYY-MM-DD")))
    ).map(date => dayjs(date));
  }
  return [dayjs()]
};

export default function SimulatorTime() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch
  } = useFormContext();

  const [dataService, setDataService] = useState<Service[]>([]);
  const [selectedData, setSelectedData] = useState<Dayjs[]>([]);
  const [dateForecast, setDateForecast] = useState<Dayjs>(dayjs());
  const { fetchServices } = useFetchServices();
  const selectedLine = watch("conclusion.line");

  const fetchData = async (value: string) => {
    try {
      
      if (selectedLine) {
        const { serviceSimulador } = await fetchServices([selectedLine]);
        
        const datasUnicas = extrairDatasUnicas(serviceSimulador);
        setSelectedData(datasUnicas)

        if (serviceSimulador.length === 0) {
          toast.error("Não existe viagem disponível na linha selecionada!");
          return;
        }

        setDataService(serviceSimulador);
        if (value) {
          const dataServiceSelected = serviceSimulador.filter((service: Service) => {
            return service.service_departure_date === dayjs(value).format("YYYY-MM-DD")
          })
          if (dataServiceSelected.length === 0) {
            toast.error("Não existe viagem disponível na data atual!");
            return;
          }
          setValue("conclusion.services", dataServiceSelected);
        }
      }
    } catch (error) {
      toast.error("Erro ao buscar dados das viagens!");
    }
  };

  useEffect(() => {
    const value = getValues("conclusion.dateForecast");

    if (value) {
      setDateForecast(dayjs(value))
      fetchData(value);
    }

  }, [selectedLine]);

  const handleAddOrUpdate = async (newValue: Dayjs) => {
    setDateForecast(newValue!)
    setValue("conclusion.dateForecast", newValue.format("YYYY-MM-DD"));
    const dataServiceSelected = dataService.filter((service: Service) => {
      return service.service_departure_date === newValue.format("YYYY-MM-DD")
    })
    if (dataServiceSelected.length === 0) {
      toast.error("Não existe viagem disponível na data selecionada!");
      return;
    }
    setValue("conclusion.services", dataServiceSelected);
  };

  return (
    <>
      {selectedLine && (
        <Box sx={{
          display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: 'center', gap: { xs: 2, sm: 1 }, paddingTop: { xs: 0, sm: 2 }
        }}>
          
            <CalendarWithHolidays label="Qual data você deseja precificar?" id={`conclusion_date-forecast`} name="dateForecast" onChange={(newValue) => handleAddOrUpdate(newValue)} value={dateForecast} datasLiberadas={selectedData} />
            <CustomInput
              id="conclusion_time-purchase"
              name="conclusion.timePurchase"
              label="Em que horário de compra?"
              placeholder=""
              type="number"
              register={register}
              validation={timePurchaseValidation}
              error={get(errors, "conclusion.timePurchase")}
              helperText={get(errors, "conclusion.timePurchase.message")}
              startAdornment={<AccessTimeIcon sx={{ color: themeScss.color.primary }} />}
            />
            <CustomInput
              id="conclusion_days-advance"
              name="conclusion.daysAdvance"
              label="Com quantos dias de antecedência?"
              placeholder=""
              type="number"
              register={register}
              validation={daysAdvanceValidation}
              error={get(errors, "conclusion.daysAdvance")}
              helperText={get(errors, "conclusion.daysAdvance.message")}
            />
        </Box>
      )}
    </>
  );
};
