import { useEffect, useState } from "react";
import { Line } from "@utils/entities";
import { useFormContext, get } from "react-hook-form";
import CustomAutoComplete from "@components/CustomAutoComplete";
import { LineService } from "@utils/services/api/line";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { themeScss } from "@theme";
import { toast } from "react-toastify";
import { useStepper } from "@providers/StepperProvider";
import { useFetchServices } from "@hooks/useFetchServices";
import PageLoader from "@components/PageLoader";

export default function SimulatorLines() {
  const {
    control,
    formState: { errors },
    setValue,
    getValues
  } = useFormContext();

  const [data, setData] = useState<Line[]>([]);
  const [selectedData, setSelectedData] = useState<Line | null>(null);
  const { setLoading } = useStepper();
  const { fetchServices } = useFetchServices();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setIsLoading(true);
        const data = await LineService.list();
        setData(data.data);

        const value = getValues("conclusion.calculationIA.line");
        if (value) await handleAddOrUpdate(value);

      } catch (error) {
        toast.error("Erro ao buscar dados de linhas!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

  }, []);

  const fetchServicesByLine = async (line: Line) => {
    try {

      const { serviceSimulador } = await fetchServices([line]);
      if (serviceSimulador.length === 0) {
        toast.error("A linha selecionada não contém viagens disponiveis!");
        return;
      }
      setValue("conclusion.services", serviceSimulador);

    } catch (error) {
      toast.error("Erro ao buscar dados de viagens!");
    }
  };

  const handleAddOrUpdate = async (newValue: Line) => {

    setIsLoading(true);
    let newData: Line = newValue
    newData.direction = {
      id: "0",
      description: "Ambos"
    }

    setSelectedData(newData)
    setValue("conclusion.calculationIA.line", newData);
    await fetchServicesByLine(newData);
    setIsLoading(false);
  };

  return (
    <>
      <CustomAutoComplete
        id="simulator-lines__line"
        name="conclusion.calculationIA.line"
        control={control}
        rules={{ required: 'Este campo é obrigatório.' }}
        value={selectedData}
        onChange={(newValue) => handleAddOrUpdate(newValue)}
        options={data}
        label="Selecione ou digite o número da linha"
        error={!!get(errors, "conclusion.calculationIA.line")}
        helperText={get(errors, "conclusion.calculationIA.message")}
        placeholder="Selecione ou digite o número da linha:"
        startIcon={<><DirectionsBusIcon fontSize="large" sx={{ color: themeScss.color.primary }} /></>}
      />
      {isLoading && <PageLoader id="simulator-lines__page-loader" />}
    </>
  );
};
