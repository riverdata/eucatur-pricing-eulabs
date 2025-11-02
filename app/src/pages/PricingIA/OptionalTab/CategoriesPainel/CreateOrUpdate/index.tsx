import { useEffect, useState, FC } from 'react';
import { FormControl, Box } from '@mui/material';
import CustomModal from '@components/CustomModal';
import { Category } from '@utils/entities';
import CustomAutoComplete from '@components/CustomAutoComplete';
import { useFormContext } from 'react-hook-form';
import { useFetchCategories } from '@hooks/useFetchCategories';
import { toast } from 'react-toastify';


const CreateOrUpdateModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Category) => void;
  dataUpdate: Category;
}> = ({ isOpen, onClose, onConfirm, dataUpdate }) => {

  const {
    getValues
  } = useFormContext();

  const [data, setData] = useState<Category[]>([]);
  const [selectedData, setSelectedData] = useState<Category | null>(null);
  const { fetchCategories } = useFetchCategories();

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const conclusion = getValues("conclusion");
        const fetchedData = await fetchCategories(conclusion.servicesEnd, [conclusion.calculationIA.line]);
        setData(fetchedData);
      } catch (error) {
        toast.error("Erro ao buscar as categorias!");
      }
    };

    fetchDataAsync();
  }, []);

  const handleSubmit = () => {
    onConfirm(selectedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      <CustomModal
        type="CategoriesPainel"
        isOpen={isOpen}
        title="Adicione Nova Categoria"
        handleSubmit={handleSubmit}
        onClose={onClose}
      >
        <Box display="inline-flex" flexDirection="column" marginTop={3} width={`100%`} >
          <FormControl>
            <CustomAutoComplete
              id="modal_categories-painel_seat"
              name="seat"
              value={selectedData}
              onChange={(newValue) => setSelectedData(newValue)}
              options={data}
              label="Selecione uma categoria"
              placeholder="Selecione uma categoria"
            />
          </FormControl>
        </Box>
      </CustomModal>
    </div >
  );
}


export default CreateOrUpdateModal;