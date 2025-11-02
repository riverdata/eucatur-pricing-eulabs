//import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  Grid2,
  Box,
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControlLabel,
  Switch
} from "@mui/material";
import BrandingSection from "@components/BrandingSection";
import PasswordField from "@components/PasswordField";

import logo from '@assets/images/logo_eucatur.svg';
import './SignIn.scss';
import { useNavigate } from "react-router-dom";
import { useUserProvider } from "@providers/UserProvider";
import StorageUser from "@utils/services/storage/user";
import StorageToken from "@utils/services/storage/token";
import { AuthService } from "@utils/services/api/auth";
import Routes from "@routes/paths";
import CustomInput from "@components/CustomInput";
import { toast } from "react-toastify";
import { LinkDefault } from "@components/LinkDefault";

interface IFormInput {
  email: string;
  password: string;
  time: boolean;
}

const emailValidation = {
  required: "O e-mail é obrigatório.",
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Digite um e-mail válido.",
  }
};

const passwordValidation = {
  required: "Campo obrigatório",
  minLength: {
    value: 1,
    message: "Campo obrigatório",
  },
};


export default function SignInScreen() {
  const navigate = useNavigate();
  const { setUser } = useUserProvider();
  const [checked, setChecked] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "all",
  });


  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {

      data.time = checked

      const { token, user } = await AuthService.login(data);
      setUser(user);
      StorageUser.set(user);
      StorageToken.set(token);

      navigate(Routes.precificacao.list, { replace: true });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };


  return (
    <Container sx={{ height: '100vh', maxWidth: '100vw !important', paddingLeft: '0px !important', paddingRight: '0px !important' }}>

      <Grid2 container spacing={0} columns={12} sx={{ display: 'flex !important', bgcolor: 'white', height: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
        <BrandingSection />
        <Grid2 id="SignInScreen" size="grow" className="signin" sx={{ bgcolor: 'white', width: { xs: '100%', md: 'auto' } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "300px",
              margin: "0 auto",
            }}>
            <img
              src={logo}
              className="signin__image"
              alt="Logo Eucatur"
              id="SignInScreen_image"
            />
            <Typography id="SignInScreen_title" variant="h5" gutterBottom>
              Seja bem-vindo!
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
              id="SignInScreen_email"
              name="email"
              label="Login"
              placeholder="E-mail"
              type="email"
              register={register}
              validation={emailValidation}
              error={errors.email}
              helperText={errors.email?.message}
            />

            <PasswordField
              id="SignInScreen_password"
              label="Inserir senha"
              name="password"
              validation={passwordValidation}
              register={register}
              errors={errors}
            />

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"

            >
              <FormControlLabel
                control={<Switch
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                  name="time"
                  id="SignInScreen_connection_button"
                />}
                sx={{
                  '.MuiFormControlLabel-label': {
                    fontSize: '12px',
                    color: '#1A1A1A !important',
                    letterSpacing: '0',
                    textAlign: 'left',
                    fontWeight: '400  !important'
                  }
                }}
                label="Lembrar Senha"
                id="SignInScreen_connection"

              />

              <LinkDefault id="SignInScreen_redirect" link={Routes.user.forgotPassword}>
                Esqueceu a senha?
              </LinkDefault>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 2, position: "relative" }}
              disabled={isSubmitting}
              id="SignInScreen_button_enter"
            >
              {isSubmitting ? (
                <>
                  <span style={{ opacity: 0 }}>Entrar</span>
                  <CircularProgress size={24} sx={{ position: "absolute", left: "50%", top: "50%", marginLeft: "-12px", marginTop: "-12px" }} />
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </Box>
        </Grid2>
      </Grid2>
    </Container >
  );
}
