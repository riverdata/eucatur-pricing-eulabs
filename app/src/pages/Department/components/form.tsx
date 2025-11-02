import Routes from "@routes/paths";
import { User } from "@utils/entities";
import { UserService } from "@utils/services/api/user";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { generatePath, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress, Button, Typography } from "@mui/material";
import CustomInput from "@components/CustomInput";
import CustomAutoComplete from "@components/CustomAutoComplete";
import { Department } from "@utils/entities/Department";
import { DepartmentService } from "@utils/services/api/department";


interface IFormInput {
  description: string;
  manager: User | null;
}

type DepartmentFormProps = {
  mode: "CREATE" | "UPDATE";
  department?: Department;
};

const formTexts = {
  CREATE: {
    formHeaderTitle: "Cadastro de departamento",
    feedbackSuccess: "Departamento cadastrado com sucesso.",
  },
  UPDATE: {
    formHeaderTitle: "Edição de departamento",
    feedbackSuccess: "Departamento atualizado com sucesso.",
  },
};

export default function DepartmentForm({ mode = "CREATE", department }: DepartmentFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: {
      description: department?.description ?? "",
      manager: department?.manager ?? null,
    },
  });

  const [selectedManager, setSelectedManager] = useState<User | null>(department?.manager ?? null);
  const [dataUsers, setDataUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserService.getAll();
        setDataUsers(response);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Erro ao buscar usuários.");
      }
    };

    fetchData();

    if (department?.managerId && department?.manager) {
      setSelectedManager(department.manager);
    }
  }, [department]);

  const onSubmit = async (data: IFormInput) => {
    try {
      const { description, manager } = data;
      const isModeCreate = mode === "CREATE";

      const departmentData = isModeCreate
        ? { description, manager }
        : { id: String(department?.id), description, manager };

      const response = await DepartmentService.createOrUpdate(departmentData);

      toast.success(formTexts[mode].feedbackSuccess);

      if (isModeCreate) {
        const formDepartmentEditPath = generatePath(Routes.department.edit, {
          id: String(response.id),
        });
        navigate(formDepartmentEditPath, { replace: true });
      } else {
        navigate(Routes.department.list, { replace: true });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao salvar departamento.");
    }
  };

  return (
    <form id={`DepartmentForm_${mode}`} onSubmit={handleSubmit(onSubmit)}>
      <Typography
        id={`DepartmentForm_${mode}_title`}
        variant="subtitle1"
        data-testid={`DepartmentForm_${mode}_title`}
      >
        {formTexts[mode].formHeaderTitle}
      </Typography>

      <CustomInput
        id={`DepartmentForm_${mode}_description`}
        name="description"
        label="Descrição *"
        placeholder="Digite a descrição"
        register={register}
        validation={{ required: "A descrição é obrigatória." }}
        error={errors.description}
        helperText={errors.description?.message}
      />

      <CustomAutoComplete
        id={`DepartmentForm_${mode}_manager`}
        name="manager"
        control={control}
        value={selectedManager}
        onChange={(newValue) => setSelectedManager(newValue)}
        options={dataUsers}
        label="Gestor"
        error={!!errors.manager}
        helperText={errors.manager?.message}
        placeholder="Selecione o gestor"
      />

      <Button
        id={`DepartmentForm_${mode}_submit`}
        data-testid={`DepartmentForm_${mode}_submit`}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, position: "relative" }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span style={{ opacity: 0 }}>Salvar</span>
            <CircularProgress
              id={`DepartmentForm_${mode}_loading`}
              size={24}
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                marginLeft: "-12px",
                marginTop: "-12px",
              }}
            />
          </>
        ) : (
          "Salvar"
        )}
      </Button>
    </form>
  );
}