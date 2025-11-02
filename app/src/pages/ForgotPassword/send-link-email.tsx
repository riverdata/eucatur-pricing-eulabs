
import Routes from "@routes/paths";
import { AccountService } from "@utils/services/api/account";
import BrandingSection from "@components/BrandingSection";
import CustomInput from "@components/CustomInput";
import { Container, Grid2, Box, Typography, Button, CircularProgress } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import logo from '@assets/images/logo_eucatur.svg';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LinkDefault } from "@components/LinkDefault";

const emailValidation = {
  required: "O e-mail é obrigatório.",
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Digite um e-mail válido.",
  }
};

interface IFormInput {
  email: string;
}


export default function SendLinkEmailScreen() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "all",
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const { email } = data;

      await AccountService.forgotPassword({ email });

      toast.success(`Um e-mail contendo as instruções foi enviado para ${email}.`);
      navigate(Routes.signIn);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <Container sx={{ height: '100vh', maxWidth: '100vw !important', paddingLeft: '0px !important', paddingRight: '0px !important' }}>
      <Grid2 container spacing={0} columns={12} sx={{ bgcolor: 'white', height: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
        <BrandingSection />
        <Grid2 id="SendLinkEmailScreen" size="grow" className="signin" sx={{ bgcolor: 'white', width: { xs: '100%', md: 'auto' } }}>
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
              id="SendLinkEmailScreen_image"
            />
            <Typography id="SendLinkEmailScreen_title" variant="h5" gutterBottom>
              Recupere a sua senha!
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
            <CustomInput
              id="SendLinkEmailScreen_email"
              name="email"
              label="E-mail de recuperação"
              placeholder="Digite seu E-mail"
              type="email"
              register={register}
              validation={emailValidation}
              error={errors.email}
              helperText={errors.email?.message}
            />

            <LinkDefault id="SendLinkEmailScreen_redirect" link={Routes.base} text='Já possui uma conta? '>
              Acessar
            </LinkDefault>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 2, position: "relative" }}
              disabled={isSubmitting}
              id="SendLinkEmailScreen_button_send"
            >
              {isSubmitting ? (
                <>
                  <span style={{ opacity: 0 }}>Enviar</span>
                  <CircularProgress size={24} sx={{ position: "absolute", left: "50%", top: "50%", marginLeft: "-12px", marginTop: "-12px" }} />
                </>) : (
                "Enviar"
              )}
            </Button>
          </Box>
        </Grid2>
      </Grid2>
    </Container >
  );
}
