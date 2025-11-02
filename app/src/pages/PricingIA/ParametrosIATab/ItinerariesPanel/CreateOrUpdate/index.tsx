import { useEffect, useState, FC } from 'react';
import { FormControl, Box } from '@mui/material';
import CustomModal from '@components/CustomModal';
import { Destination, Line, Origin, RoutePoints, Sections, Service } from '@utils/entities';
import CustomAutoComplete from '@components/CustomAutoComplete';
import { RoutePointsService } from '@utils/services/api/routePoints';
import { useFormContext, get } from 'react-hook-form';

import { toast } from "react-toastify";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { themeScss } from "@theme";
import PageLoader from "@components/PageLoader";

const fetchOrigins = async (line: Line, dataSections: string[]) => {
  try {
    const response = await RoutePointsService.listByLine(line.line_code);
    const data = response.data.filter(item => dataSections.length > 0 ? dataSections.includes(item.sectional_code) : true);

    return data;
  } catch (error) {
    toast.error("Erro ao buscar origens!");
    return [];
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
    return [];
  }
};


const CreateOrUpdateModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: RoutePoints) => void;
  dataUpdate: RoutePoints;
}> = ({ isOpen, onClose, onConfirm, dataUpdate }) => {

  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    watch
  } = useFormContext();

  const [dataSections, setDataSections] = useState<string[]>();
  const [selectedData, setSelectedData] = useState<Line>(getValues("conclusion.calculationIA.line"));
  const [dataOrigin, setDataOrigin] = useState<Origin[]>([]);
  const [dataDestinations, setDataDestinations] = useState<Destination[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const services = watch("conclusion.services");


  useEffect(() => {

    const fetchData = async () => {
      try {

        setIsLoading(true);
        let dataSections: string[] = []
        dataSections = [...dataSections, ...extractSections(services)]

        const uniqueDataSections = Array.from(new Set(dataSections));

        const data = await fetchOrigins(selectedData, uniqueDataSections);
        setDataOrigin(data);

      } catch (error) {
        toast.error("Erro ao buscar dados!");
      } finally {
        setIsLoading(false);
      }
    };
    if (services.length > 0) fetchData();

  }, [services.length > 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const data = await fetchDestinations(selectedOrigin);
        setDataDestinations(data);

      } catch (error) {
        toast.error("Erro ao buscar dados!");
      }
    };
    if (selectedOrigin) fetchData();

  }, [selectedOrigin]);

  const handleSubmit = () => {
    let routesSelected = {
      description: selectedDestination.routeRoint.description,
      route_km: selectedDestination.routeRoint.route_km,
      line: selectedDestination.routeRoint.line,
      origin: selectedDestination.routeRoint.origin,
      destination: selectedDestination.routeRoint.destination,
    }

    onConfirm(routesSelected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      <CustomModal
        type="ItinerariesPainel"
        isOpen={isOpen}
        title="Adicione novo itinerário"
        handleSubmit={handleSubmit}
        onClose={onClose}
      >
        {isLoading ? <PageLoader id="itineraries-painel__page-loader" /> : (
          <Box display="inline-flex" flexDirection="column" marginTop={3} width={`100%`} >
            <FormControl>
              <CustomAutoComplete
                id="modal_ItinerariesPainel_origin"
                name="origin"
                rules={{ required: 'Este campo é obrigatório.' }}
                value={selectedOrigin}
                onChange={(newValue) => setSelectedOrigin(newValue)}
                options={dataOrigin}
                label="Selecione ou digite o número da origem"
                error={!!get(errors, "conclusion.calculationIA.origin")}
                helperText={get(errors, "conclusion.calculationIA.origin.message")}
                placeholder="Selecione ou digite o número da origem"
                startIcon={<><DirectionsBusIcon fontSize="large" sx={{ color: themeScss.color.primary }} />
                  <DirectionsWalkIcon sx={{ color: themeScss.color.primary, transform: 'scaleX(-1)' }} /></>}
              />

              <CustomAutoComplete
                id="modal_ItinerariesPainel_destination"
                name="destination"
                rules={{ required: 'Este campo é obrigatório.' }}
                value={selectedDestination}
                onChange={(newValue) => setSelectedDestination(newValue)}
                options={dataDestinations}
                label="Selecione ou digite o número do destino"
                error={!!get(errors, "conclusion.calculationIA.destination")}
                helperText={get(errors, "conclusion.calculationIA.destination.message")}
                placeholder="Selecione ou digite o número do destino"
                startIcon={<><DirectionsBusIcon fontSize="large" sx={{ color: themeScss.color.primary }} />
                  <DirectionsWalkIcon sx={{ color: themeScss.color.primary }} /></>} />
            </FormControl>
          </Box>
        )}
      </CustomModal>
    </div >
  );
}


export default CreateOrUpdateModal;