import Routes from "@routes/paths";
import { User, UserRole, UserRoleDescriptions, UserStatus } from "@utils/entities";
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
import { useUserProvider } from "@providers/UserProvider";

interface IFormInput {
  name: string;
  surname: string;
  email: string;
  department: Department;
  role: {
    value: string;
    description: string;
  };
}

type UserFormProps = {
  mode: "CREATE" | "UPDATE";
  user?: User;
};

const emailValidation = {
  required: "O e-mail é obrigatório.",
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Digite um e-mail válido.",
  },
};

const formTexts = {
  CREATE: {
    formHeaderTitle: "Cadastro de usuário",
    feedbackSuccess: "Usuário cadastrado com sucesso. Um e-mail de ativação foi enviado.",
  },
  UPDATE: {
    formHeaderTitle: "Edição de usuário",
    feedbackSuccess: "Usuário atualizado com sucesso.",
  },
};

export default function UserForm({ mode = "CREATE", user }: UserFormProps) {
  const navigate = useNavigate();
  const { user: currentUser } = useUserProvider();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      surname: user?.surname ?? "",
      department: user?.department ?? null,
      role: {
        value: user?.role ?? UserRole.USER,
        description: user?.role ?? UserRole.USER,
      },
    },
  });

  const [selectedDepartment, setSelectedDepartment] = useState<Department>(user?.department || null);
  const [dataDepartments, setDataDepartments] = useState<Department[]>([]);
  const [selectedRole, setSelectedRole] = useState<{ value: UserRole; description: string } | null>(null);
  const [dataRoles] = useState<{ value: UserRole; description: string }[]>(
    Object.values(UserRole).map((role) => ({
      value: role,
      description: UserRoleDescriptions[role],
    }))
  );

  const isAdmin = currentUser?.role === UserRole.ADMINMANAGER || currentUser?.role === UserRole.MASTERADMIN;

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await DepartmentService.list();
        setDataDepartments(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Erro ao buscar departamentos");
      }
    }

    fetchDepartments();

    if (user?.role) {
      const roleObj = dataRoles.find((r) => r.value === user.role);
      if (roleObj) setSelectedRole(roleObj);
    }
  }, []);

  async function onSubmit(data: IFormInput) {
    try {
      const isModeCreate = mode === "CREATE";
      const { name, surname, email, department, role } = data;

      let userData: any = isModeCreate
        ? { name, surname, email }
        : { id: String(user?.id), name, surname, email };

      if (isAdmin) {
        userData = {
          ...userData,
          department,
          role: role.value,
        };
      }

      const response = await UserService.createOrUpdate(userData);

      toast.success(formTexts[mode].feedbackSuccess);

      if (isModeCreate) {
        const editPath = generatePath(Routes.user.edit, { id: String(response.id) });
        navigate(editPath, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao salvar usuário");
    }
  }

  async function resendActivationEmail() {
    try {
      await UserService.resendEmailActivation(user?.id as string);
      toast.success("O e-mail de ativação de conta foi reenviado para o usuário");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao reenviar e-mail");
    }
  }

  const canResendEmail = mode === "UPDATE" && user?.status === UserStatus.PENDING;

  return (
    <form id={`UserForm_${mode}`} onSubmit={handleSubmit(onSubmit)}>
      <Typography id={`UserForm_${mode}_title`} variant="subtitle1">
        {formTexts[mode].formHeaderTitle}
      </Typography>

      <CustomInput
        id={`UserForm_${mode}_name`}
        name="name"
        label="Nome *"
        placeholder="Digite o nome"
        register={register}
        validation={{ required: "O nome é obrigatório." }}
        error={errors.name}
        helperText={errors.name?.message}
      />

      <CustomInput
        id={`UserForm_${mode}_surname`}
        name="surname"
        label="Sobrenome"
        placeholder="Digite o sobrenome"
        register={register}
      />

      <CustomInput
        id={`UserForm_${mode}_email`}
        name="email"
        label="E-mail *"
        placeholder="Digite o e-mail"
        type="email"
        register={register}
        validation={emailValidation}
        error={errors.email}
        helperText={errors.email?.message}
      />

      {isAdmin && (
        <>
          <CustomAutoComplete
            id={`UserForm_${mode}_department`}
            name="department"
            control={control}
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            options={dataDepartments}
            label="Departamento"
            error={!!errors.department}
            helperText={errors.department?.message}
            placeholder="Selecione o departamento"
          />

          <CustomAutoComplete
            id={`UserForm_${mode}_role`}
            name="role"
            control={control}
            value={selectedRole}
            onChange={(newValue) => setSelectedRole(newValue)}
            options={dataRoles}
            label="Função"
            error={!!errors.role}
            helperText={errors.role?.message}
            placeholder="Selecione a função"
          />
        </>
      )}

      {canResendEmail && isAdmin && (
        <Button
          id={`UserForm_${mode}_button_send`}
          type="button"
          variant="outlined"
          disabled={isSubmitting}
          sx={{ mt: 3, backgroundColor: "#DA2128" }}
          onClick={resendActivationEmail}
        >
          Reenviar e-mail de ativação
        </Button>
      )}

      <Button
        id={`UserForm_${mode}_button_save`}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, position: "relative" }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span style={{ opacity: 0 }}>Salvar</span>
            <CircularProgress size={24} sx={{ position: "absolute", left: "50%", top: "50%", ml: "-12px", mt: "-12px" }} />
          </>
        ) : (
          "Salvar"
        )}
      </Button>
    </form>
  );
}