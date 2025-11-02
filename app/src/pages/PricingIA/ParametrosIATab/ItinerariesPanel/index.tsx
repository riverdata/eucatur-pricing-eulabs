import { useEffect, useState } from "react";
import {
  TableCell,
  TableRow,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { RoutePoints } from "@utils/entities";
import { useFormContext } from "react-hook-form";
import CreateOrUpdateModal from "./CreateOrUpdate";
import CustomOptional from "@components/CustomOptional";
import { useStepper } from "@providers/StepperProvider";

export default function ItinerariesPainel() {
  const {
    setValue,
    getValues
  } = useFormContext();

  const [data, setData] = useState<RoutePoints[]>(getValues("conclusion.calculationIA.itineraries"));
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<RoutePoints>();
  const { setLoading } = useStepper();
  
  const handleRemove = (description: string) => {
    let updateData = data.filter((item) => item.description.toUpperCase().trim() !== description.toUpperCase().trim())

    if (updateData.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    setData(updateData);
    setValue("conclusion.calculationIA.itineraries", updateData);
  };

  const handleAddOrUpdate = async (newValue: RoutePoints) => {
    let updateData = []

    if (data.some((item) => item.description.toUpperCase().trim() === newValue.description.toUpperCase().trim())) {
      updateData = data.map((item) =>
        item.description.toUpperCase().trim() === newValue.description.toUpperCase().trim() ? newValue : item
      )
    } else {
      updateData = [...data, newValue];
    }

    setData(updateData)
    setValue("conclusion.calculationIA.itineraries", updateData);
    setShowCreateModal(false);
  };

  useEffect(() => {
    setLoading(false);
  }, []);
  

  return (
    <>
      <CustomOptional id="ItinerariesPainel" title="Itinerários Adicionados" tableLabel={['Código', 'Origem', 'Código', 'Destino', 'Opções']} openModal={() => setShowCreateModal(true)}>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.origin.sectional_code}</TableCell>
            <TableCell>{row.origin.sectional_description}</TableCell>
            <TableCell>{row.destination.sectional_code}</TableCell>
            <TableCell>{row.destination.sectional_description}</TableCell>
            <TableCell>
              <IconButton
                id={`ItinerariesPainel_button_remove`}
                color="error"
                onClick={() => handleRemove(row.description)}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </CustomOptional>
      <CreateOrUpdateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleAddOrUpdate}
        dataUpdate={selectedData}
      />
    </>
  );
};
