import { useEffect, useState } from "react";
import { Destination, Line, Origin, RoutePoints, Service } from "@utils/entities";
import { useFormContext, get } from "react-hook-form";
import CustomAutoComplete from "@components/CustomAutoComplete";
import { RoutePointsService } from "@utils/services/api/routePoints";
import { useFetchCategories } from "@hooks/useFetchCategories";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { themeScss } from "@theme";
import { Box } from "@mui/material";
import { useFetchPrices } from "@hooks/useFetchPricesIA";
import { generateSeats } from "@components/CustomSeats";
import { toast } from "react-toastify";

const fetchOrigins = async (line: Line, dataSections: string[]) => {
  try {
    const response = await RoutePointsService.listByLine(line.line_code);
    const data = response.data.filter((item: any) => dataSections.length > 0 ? dataSections.includes(item.sectional_code) : true);

    return data;
  } catch (error) {
    toast.error("Erro ao buscar origens!");
    return []
  }
};

const extractSections = (items: Service[]) => items.flatMap(item =>
  item.sections.map(section => section.code)
);


const fetchDestinations = async (origin: Origin) => {
  try {
    const response = await RoutePointsService.listByOriginAndLine(origin.line.line_code, origin.sectional_code);
    return response.data;
  } catch (error) {
    toast.error("Erro ao buscar destinos!");
    return []
  }
};


export default function SimulatorItineraries() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch
  } = useFormContext();

  const [data, setData] = useState<Line[]>([]);
  const [selectedData, setSelectedData] = useState<Origin | null>(null);
  const [dataDestinations, setDataDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const { fetchCategories } = useFetchCategories();
  const dateForecast = watch("conclusion.dateForecast");
  const services = watch("conclusion.services");
  const { fetchPricesIA } = useFetchPrices();

  useEffect(() => {
    let conclusion = getValues("conclusion");
    if (conclusion.line && dateForecast && services.length === 0) {
      toast.error("Não existe viagens para esta linha e horário!");
      return;
    }

    const fetchData = async () => {
      try {

        const dataCategory = await fetchCategories(services, conclusion.line);
        setValue("conclusion.categories", dataCategory);

        let dataSections: string[] = []
        dataSections = [...dataSections, ...extractSections(services)]
        const uniqueDataSections = Array.from(new Set(dataSections));

        const data = await fetchOrigins(conclusion.line, uniqueDataSections);
        setData(data);

      } catch (error) {
        toast.error("Erro ao buscar dados!");
      }
    };

    if (services.length > 0) fetchData();

    if (conclusion.origin) setSelectedData(conclusion.origin);

  }, [services.length > 0, dateForecast]);


  useEffect(() => {

    const fetchData = async () => {
      try {

        const data = await fetchDestinations(selectedData);
        setDataDestinations(data);

      } catch (error) {
        toast.error("Erro ao buscar dados!");
      }
    };
    if (selectedData) fetchData();

    const value = getValues("conclusion.destination");
    if (value) setSelectedDestination(value);

  }, [selectedData]);

  const fetchSeats = async (itineraries: RoutePoints) => {
    try {
      let conclusion = getValues("conclusion");

      let data: Service[] = services.map((item: Service) => ({
        ...item,
        priceEnd: (item.priceEnd ?? []).map((price) => ({
          ...price,
          seats: price.seats ?? generateSeats(Number(item.service_seats), 46),
        })),
      }));
      
      setValue("conclusion.services", data);

      let dataSeats: Service[] = await fetchPricesIA(data, conclusion.categories, [itineraries])

      setValue("conclusion.servicesEnd", dataSeats);

      toast.success("Viagens encontradas com sucesso!");
    } catch (error) {
      toast.error("Não foram encontradas viagens!");
    }
  };

  const handleAddOrUpdate = async (newValue: Destination) => {

    setSelectedDestination(newValue)
    setValue("conclusion.origin", selectedData);
    setValue("conclusion.destination", newValue);
    const itineraries = newValue.routeRoint;
    await fetchSeats(itineraries);
  };

  return (
    <>
      {services.length > 0 && (
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <CustomAutoComplete
            id="conclusion_origin"
            name="conclusion.origin"
            control={control}
            rules={{ required: 'Este campo é obrigatório.' }}
            value={selectedData}
            onChange={(newValue) => setSelectedData(newValue)}
            options={data}
            label="Selecione ou digite o número da origem"
            error={!!get(errors, "conclusion.origin")}
            helperText={get(errors, "conclusion.origin.message")}
            placeholder="Selecione ou digite o número da origem:"
            startIcon={<><DirectionsBusIcon fontSize="large" sx={{ color: themeScss.color.primary }} />
              <DirectionsWalkIcon sx={{ color: themeScss.color.primary, transform: 'scaleX(-1)' }} /></>}
          />

          <CustomAutoComplete
            id="conclusion_destination"
            name="conclusion.destination"
            control={control}
            rules={{ required: 'Este campo é obrigatório.' }}
            value={selectedDestination}
            onChange={(newValue) => handleAddOrUpdate(newValue)}
            options={dataDestinations}
            label="Selecione ou digite o número do destino"
            error={!!get(errors, "conclusion.destination")}
            helperText={get(errors, "conclusion.destination.message")}
            placeholder="Selecione ou digite o número do destino:"
            startIcon={<><DirectionsBusIcon fontSize="large" sx={{ color: themeScss.color.primary }} />
              <DirectionsWalkIcon sx={{ color: themeScss.color.primary }} /></>}
          />
        </Box>
      )}
    </>
  );
};
