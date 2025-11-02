import { useState, FC } from "react";
import { IconButton, InputAdornment, TextFieldProps, FormControl, Typography, OutlinedInput, FormHelperText } from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { themeScss } from "@theme";


const passwordValidation = {
  required: "A senha é obrigatória.",
  minLength: {
    value: 6,
    message: "A senha deve ter pelo menos 6 caracteres.",
  },
  maxLength: {
    value: 20,
    message: "A senha não pode exceder 20 caracteres.",
  },
  validate: {
    hasUpperCase: (value: string) =>
      /[A-Z]/.test(value) || "A senha deve conter uma letra maiúscula.",
    hasNumber: (value: string) =>
      /\d/.test(value) || "A senha deve conter um número.",
    hasSpecialChar: (value: string) =>
      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
      "A senha deve conter um caractere especial.",
  },
};

interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'InputProps'> {
  label: string;
  id: string;
  name: string;
  validation?: object;
  register: any;
  errors: any;
}

const PasswordField: FC<PasswordFieldProps> = ({
  label,
  id,
  name,
  validation = passwordValidation,
  register,
  errors,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  


  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };
  
  const hasError = Boolean(errors?.message);
  const borderColor = hasError ? themeScss.color.error : themeScss.input.borderColorFocus;

  return (
    <FormControl error={hasError} sx={{ width: "100%" }}>
      <Typography id={`${id}_label`} variant="body1" sx={{ marginBottom: "4px" }}>
        {label}
      </Typography>

      <OutlinedInput
        id={`${id}_input`}
        type={showPassword ? "text" : "password"}
        placeholder={label}
        {...register(name, validation)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        sx={{
          color: themeScss.input.color,
          backgroundColor: themeScss.input.bgColor,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: hasError ? themeScss.color.error : themeScss.input.borderTranspartent,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: borderColor,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: borderColor,
          },
        }}
      />
      {hasError && <FormHelperText id={`${id}_helper_text`}>{errors.message}</FormHelperText>}

    </FormControl>
  );
};

export default PasswordField;
