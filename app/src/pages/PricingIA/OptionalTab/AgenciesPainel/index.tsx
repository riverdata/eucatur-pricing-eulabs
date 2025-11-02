import { useState } from "react";
import {
  TableCell,
  TableRow,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Agency } from "@utils/entities";
import { useFormContext } from "react-hook-form";
import CreateOrUpdateModal from "./CreateOrUpdate";
import CustomOptional from "@components/CustomOptional";

const AgenciesPainel = () => {
  const { setValue, getValues } = useFormContext();

  const [data, setData] = useState<Agency[]>(
    getValues("conclusion.optionalDetails.agencies") || []
  );
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const handleRemove = (id: string) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    setValue("conclusion.optionalDetails.agencies", updatedData);
  };

  const handleAddOrUpdate = (newAgencies: Agency[]) => {
    const existingIds = data.map((a) => a.id);
    const mergedData = [...data];

    newAgencies.forEach((agency) => {
      const isAllTypeAgency = agency.id.startsWith("ALL-");
  
      const hasAllAgencyOfSameType = mergedData.some(
        (a) => a.id === `ALL-${agency.agency_type.agency_code}`
      );
  
      if (!isAllTypeAgency && hasAllAgencyOfSameType) {
        return;
      }
  
      const existingAllIndex = mergedData.findIndex(
        (a) => a.id === agency.id
      );
  
      if (existingAllIndex !== -1) {
        mergedData[existingAllIndex] = agency;
      } else if (!existingIds.includes(agency.id)) {
        mergedData.push(agency);
      } else {
        const updateIndex = mergedData.findIndex((a) => a.id === agency.id);
        if (updateIndex !== -1) {
          mergedData[updateIndex] = agency;
        }
      }
    });
  

    setData(mergedData);
    setValue("conclusion.optionalDetails.agencies", mergedData);
    setShowCreateModal(false);
  };

  return (
    <>
      <CustomOptional
        id="agencies-painel"
        title="Agências Adicionadas"
        tableLabel={["Codigo", "Descrição", "Tipo", "Opções"]}
        openModal={() => setShowCreateModal(true)}
      >
        {data.map((agency, index) => (
          <TableRow key={agency.id}>
            <TableCell id={`agencies-painel__agencyCode-${index}`}>
              {agency.agency_code}
            </TableCell>
            <TableCell id={`agencies-painel__agencyDescription-${index}`} sx={{whiteSpace: 'wrap'}}>
              {agency.description}
            </TableCell>
            <TableCell id={`agencies-painel__agencyType-${index}`}>
              {agency.agency_type.description}
            </TableCell>
            <TableCell id={`agencies-painel__actions-${index}`}>
              <IconButton
                id={`agencies-painel__button-remove-${index}`}
                color="error"
                onClick={() => handleRemove(agency.id)}
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
      />
    </>
  );
};

export default AgenciesPainel;
