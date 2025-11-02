import { FC } from "react";
import { OutlinedInput, Typography, FormControl, FormHelperText, InputAdornment } from "@mui/material";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

import { themeScss } from "@theme";

interface CustomInputProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<any>;
  validation?: RegisterOptions;
  error?: any;
  helperText?: any;
  defaultValue?: any;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;  // Aceita qualquer componente React
}

const CustomInput: FC<CustomInputProps> = ({
  id,
  name,
  label = "",
  placeholder = "",
  type = "text",
  onChange,
  register,
  validation,
  error,
  helperText,
  defaultValue,
  endAdornment, 
  startAdornment,// Agora aceita um ícone opcional
}) => {
  const borderColor = error ? themeScss.color.error : themeScss.input.borderColorFocus;

  return (
    <FormControl error={!!error} sx={{ width: "100%" }}>
      <Typography id={`${id}_label`} variant="body1" sx={{ marginBottom: "4px" }}>
        {label}
      </Typography>
      <OutlinedInput
        id={`${id}_input`}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register(name, { ...validation, onChange })}
        endAdornment={
          endAdornment ? ( // Se um ícone for passado, ele será exibido
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : null
        }
        startAdornment={
          startAdornment ? ( // Se um ícone for passado, ele será exibido
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : null
        }
        sx={{
          color: themeScss.input.color,
          backgroundColor: themeScss.input.bgColor,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? themeScss.color.error : themeScss.input.borderTranspartent,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: borderColor,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: borderColor,
          },
        }}
      />
      {helperText && (
        <FormHelperText id={`${id}_helper_text`} sx={{ color: themeScss.color.error }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomInput;
