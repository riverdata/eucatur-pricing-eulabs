import Routes from "@routes/paths";
import { AccountService } from "@utils/services/api/account";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Grid2, Box, Typography, Button, CircularProgress } from "@mui/material";
import BrandingSection from "@components/BrandingSection";
import logo from '@assets/images/logo_eucatur.svg';
import PasswordField from "@components/PasswordField";
import { toast } from "react-toastify";
import { LinkDefault } from "@components/LinkDefault";

interface IFormInput {
  password: string;
  confirmPassword: string;
}

export default function UserActiveAccountScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: { password: "", confirmPassword: "" }
  });

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
      const token = searchParams.get("token") as string;
      const { password } = data;

      await AccountService.active({ token, password });

      toast.success("Sua conta foi ativada com sucesso.");
      navigate(Routes.signIn);
    } catch (error) {
      toast.error(error.response.data.message);
      navigate(Routes.base);
    }
  }

  return (
    <Container sx={{ height: '100vh', maxWidth: '100vw !important', paddingLeft: '0px !important', paddingRight: '0px !important' }}>

      <Grid2 container spacing={0} columns={12} sx={{ bgcolor: 'white', height: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
        <BrandingSection />
        <Grid2 id="UserActiveAccountScreen" size="grow" className="signin" sx={{ bgcolor: 'white', width: { xs: '100%', md: 'auto' } }}>
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
              alt="Logo Eucatur"
              id="UserActiveAccountScreen_image"
            />
            <Typography id="UserActiveAccountScreen_title" variant="h5" gutterBottom>
              Cadastre sua senha e ative sua conta!
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
              id="UserActiveAccountScreen_password"
              label="Inserir senha"
              name="password"
              register={register}
              errors={errors.password}
            />

            <PasswordField
              id="UserActiveAccountScreen_confirmPassword"
              label="Confirme sua senha"
              name="confirmPassword"
              register={register}
              validation={confirmPasswordValidation}
              errors={errors.confirmPassword}
            />

            <LinkDefault id="UserActiveAccountScreen_redirect" link={Routes.base} text='Já possui uma conta? '>
              Acessar
            </LinkDefault>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 2, position: "relative" }}
              disabled={isSubmitting}
              id="UserActiveAccountScreen_button_register"
            >
              {isSubmitting ? (<>
                <span style={{ opacity: 0 }}>Cadastrar senha</span>
                <CircularProgress size={24} sx={{ position: "absolute", left: "50%", top: "50%", marginLeft: "-12px", marginTop: "-12px" }} />
              </>) : (
                "Cadastrar senha"
              )}
            </Button>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
}
