import { useEffect, useState, FC } from "react";
import { Box, Paper, Checkbox, TableRow, Button, TableCell, TableBody, TableHead, TableContainer, Table } from "@mui/material";
import CustomModal from "@components/CustomModal";
import { Agency, AgencyType } from "@utils/entities";
import CustomAutoComplete from "@components/CustomAutoComplete";
import { toast } from "react-toastify";
import { AgencyService } from "@utils/services/api/agency";
import PageLoader from "@components/PageLoader";

interface CreateOrUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Agency[]) => void;
}

const extractUniqueAgencyTypes = (agencies: Agency[]): AgencyType[] => {
  const map = new Map<string, AgencyType>();
  agencies.forEach((a) => {
    if (a.agency_type?.id) {
      map.set(a.agency_type.id, a.agency_type);
    }
  });
  return Array.from(map.values());
};

const CreateOrUpdateModal: FC<CreateOrUpdateModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [data, setData] = useState<Agency[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<AgencyType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await AgencyService.listActive();
        const agencies = response.data;
        setData(agencies);

        const uniqueTypes = extractUniqueAgencyTypes(agencies);
        const defaultType = uniqueTypes[0] || null;
        setSelectedType(defaultType);


        setIsLoading(false);
        setSelectedIds([]);
      } catch (error) {
        setIsLoading(false);
        toast.error("Erro ao buscar as agências!");
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  const handleSelectByType = (type: AgencyType) => {
    setSelectedType(type);
    setSelectedIds([]);
  };

  const dataFilter = data.filter(a => selectedType?.id === a.agency_type.id);

  const handleToggle = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const selectedAgencies = data.filter(agency => selectedIds.includes(agency.id));

    if (selectedIds.length === dataFilter.length && selectedType) {
      const allAgency: Agency = {
        id: `ALL-${selectedType.agency_code}`,
        description: `Todas (${selectedType.agency_code})`,
        agency_id: -1,
        agency_code: `ALL-${selectedType.agency_code}`,
        agency_description: `TODAS-${selectedType.agency_code}`,
        agency_boarding_disembarking: '',
        agency_typeId: selectedType.id,
        agency_type: selectedType,
        agency_status: 'NORMAL'
      };
      onConfirm([allAgency]);
    } else {
      onConfirm(selectedAgencies);
    }

    onClose();
  };

  const uniqueTypes = Array.from(new Map(data.map(a => [a.agency_type.id, a.agency_type])).values());

  if (!isOpen) return null;

  return (
    <CustomModal
      type="AgenciesPainel"
      isOpen={isOpen}
      title="Adicione Nova Agência"
      handleSubmit={handleSubmit}
      onClose={onClose}
    >
      <Box display="flex" alignItems="end" flexDirection="row" mb={3} sx={{ gap: 3 }}>

        <CustomAutoComplete
          id="modal_agencies-type-painel__agency"
          name="agency"
          value={selectedType}
          onChange={handleSelectByType}
          options={uniqueTypes}
          label="Selecione um tipo de agência"
          placeholder="Selecione um tipo de agência"
        />
        <Button id={`modal_AgenciesPainel_save`} onClick={handleSubmit}>
          Salvar
        </Button>
      </Box>

      {isLoading ? (
        <PageLoader />
      ) : (
        dataFilter.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedIds.length > 0 && selectedIds.length < dataFilter.length
                      }
                      checked={
                        dataFilter.length > 0 && selectedIds.length === dataFilter.length
                      }
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedIds(isChecked ? dataFilter.map(a => a.id) : []);
                      }}
                    />
                  </TableCell>
                  <TableCell id={`agencies-painel__description`}>Descrição</TableCell>
                  <TableCell id={`agencies-painel__agency-type`}>Tipo de agência</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFilter.map((agency: Agency, index: number) => (
                  <TableRow key={agency.id} onClick={() => handleToggle(agency.id)}>
                    <TableCell>
                      <Checkbox checked={selectedIds.includes(agency.id)} />
                    </TableCell>
                    <TableCell id={`agencies-painel__description-${index}`}>{agency.description}</TableCell>
                    <TableCell id={`agencies-painel__agency-type-${index}`}>{agency.agency_type.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </CustomModal>
  );
};

export default CreateOrUpdateModal;
