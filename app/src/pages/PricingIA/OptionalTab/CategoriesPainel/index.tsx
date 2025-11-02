import { useEffect, useState } from "react";
import {
  TableCell,
  TableRow,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Category } from "@utils/entities";
import { useFormContext } from "react-hook-form";
import CreateOrUpdateModal from "./CreateOrUpdate";
import CustomOptional from "@components/CustomOptional";
import { useFetchCategories } from "@hooks/useFetchCategories";
import { toast } from "react-toastify";

export default function CategoriesPainel() {
  const {
    setValue,
    getValues
  } = useFormContext();

  const [data, setData] = useState<Category[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<Category>();
  const { fetchCategories } = useFetchCategories();


  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        let categories = getValues("conclusion.optionalDetails.categories");

        if (categories.length > 0) {
          setData(categories);
        } else {
          const conclusion = getValues("conclusion");
          const fetchedData = await fetchCategories(conclusion.serviceEnd, conclusion.calculationIA.line);
          setData(fetchedData);
        }
      } catch (error) {
        toast.error("Erro ao buscar as categorias!");
      }

    };

    fetchDataAsync();
  }, []);

  const handleRemove = (id: string) => {
    let updateData = data.filter((item) => item.id !== id)

    setData(updateData);
    setValue("conclusion.optionalDetails.categories", updateData);
  };

  const handleAddOrUpdate = async (newValue: Category) => {
    let updateData = []

    if (data.some((item) => item.id === newValue.id)) {
      updateData = data.map((item) =>
        item.id === newValue.id ? newValue : item
      )
    } else {
      updateData = [...data, newValue];
    }

    setData(updateData);
    setValue("conclusion.optionalDetails.categories", updateData);
    setShowCreateModal(false);
  };

  return (
    <>
      <CustomOptional id="categories-painel" title="Categorias Adicionadas" tableLabel={['Codigo', 'descrição', 'Opções']} openModal={() => setShowCreateModal(true)}>
        {data.map((category, index: number) => (
          <TableRow key={category.id}>
            <TableCell id={`categories-painel__code-${index}`}>{category.class_code}</TableCell>
            <TableCell id={`categories-painel__description-${index}`}>{category.class_description}</TableCell>
            <TableCell>
              <IconButton

                id={`categories-painel__button-remove`}
                color="error"
                onClick={() => handleRemove(category.id)}
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
