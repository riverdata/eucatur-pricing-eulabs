import { useEffect, useState } from "react";
import { Line } from "@utils/entities";
import { useFormContext, get } from "react-hook-form";
import CustomAutoComplete from "@components/CustomAutoComplete";
import { LineService } from "@utils/services/api/line";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { themeScss } from "@theme";
import { toast } from "react-toastify";

export default function SimulatorLines() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    getValues
  } = useFormContext();

  const [data, setData] = useState<Line[]>([]);
  const [selectedData, setSelectedData] = useState<Line | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await LineService.list();
        setData(data.data);
      } catch (error) {
        toast.error("Erro ao buscar dados!");
      }
    };
    fetchData();
    const value = getValues("conclusion.line");
    if (value) setSelectedData(value)
  }, []);

  const handleAddOrUpdate = async (newValue: Line) => {

    let newData: Line = newValue
    newData.direction = {
      id: "0",
      description: "Ambos"
    }

    setSelectedData(newData)
    setValue("conclusion.line", newData);
  };

  return (
    <>
      <CustomAutoComplete
        id="conclusion_line"
        name="conclusion.line"
        control={control}
        rules={{ required: 'Este campo é obrigatório.' }}
        value={selectedData}
        onChange={(newValue) => handleAddOrUpdate(newValue)}
        options={data}
        label="Selecione ou digite o número da linha"
        error={!!get(errors, "conclusion.line")}
        helperText={get(errors, "conclusion.line.message")}
        placeholder="Selecione ou digite o número da linha:"
        startIcon={<><DirectionsBusIcon fontSize="large" sx={{ color: themeScss.color.primary }} /></>}
      />
    </>
  );
};
