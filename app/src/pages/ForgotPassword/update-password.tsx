import Routes from "@routes/paths";
import { AccountService } from "@utils/services/api/account";
import { Container, Grid2, Box, CircularProgress, Button, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import BrandingSection from "@components/BrandingSection";
import PasswordField from "@components/PasswordField";
import { toast } from "react-toastify";
import logo from '@assets/images/logo_eucatur.svg';
import { useNavigate } from "react-router-dom";
import { LinkDefault } from "@components/LinkDefault";

interface IFormInput {
  password: string;
  confirmPassword: string;
}

type ScreenProps = {
  token?: string;
};

export default function UpdatePasswordScreen({ token }: ScreenProps) {

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: { password: "", confirmPassword: "" }
  });
  const navigate = useNavigate();

  const confirmPasswordValidation = {
    required: "Campo obrigatório",
    minLength: {
      value: 1,
      message: "Campo obrigatório",
    },
    validate: (value: string) => {
      if (value !== getValues("password")) {
        return "As senhas não correspondem";
      }
      return true;
    },
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const { password } = data;

      await AccountService.updatePassword({ token: String(token), password });

      toast.success("Sua senha foi atualizada com sucesso.");
      navigate(Routes.signIn);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <Container sx={{ height: '100vh', maxWidth: '100vw !important', paddingLeft: '0px !important', paddingRight: '0px !important' }}>

      <Grid2 container spacing={0} columns={12} sx={{ bgcolor: 'white', height: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
        <BrandingSection />
        <Grid2 id="UpdatePasswordScreen" size="grow" className="signin" sx={{ bgcolor: 'white', width: { xs: '100%', md: 'auto' } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "300px",
              margin: "0 auto",
              textAlign: 'center'
            }}>
            <img
              src={logo}
              className="signin__image"
              alt="Logo Eucatur"
              id="UpdatePasswordScreen_image"
            />
            <Typography id="UpdatePasswordScreen_title" variant="h5" gutterBottom>
              Atualize sua senha!
            </Typography>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "300px",
              margin: "0 auto",
            }}
          >
            <PasswordField
              id={"UpdatePasswordScreen_password"}
              label="Inserir senha"
              name="password"
              register={register}
              errors={errors.password} />

            <PasswordField
              id={"UpdatePasswordScreen_confirmPassword"}
              label="Confirme sua senha"
              name="confirmPassword"
              register={register}
              validation={confirmPasswordValidation}
              errors={errors.confirmPassword}
            />

            <LinkDefault id="UpdatePasswordScreen_redirect" link={Routes.base} text='Já possui uma conta? '>
              Acessar
            </LinkDefault>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 2, position: "relative" }}
              disabled={isSubmitting}
              id="UpdatePasswordScreen_button_update"
            >
              {isSubmitting ? (
                <>
                  <span style={{ opacity: 0 }}>Atualizar</span>
                  <CircularProgress size={24} sx={{ position: "absolute", left: "50%", top: "50%", marginLeft: "-12px", marginTop: "-12px" }} />
                </>) : (
                "Atualizar"
              )}
            </Button>
          </Box>
        </Grid2>
      </Grid2>
    </Container >
  );
}
