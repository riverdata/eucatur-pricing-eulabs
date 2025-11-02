import { FC } from 'react';
import { Controller, Control } from 'react-hook-form';
import { Autocomplete, Box, FormHelperText, TextField, Typography } from '@mui/material';
import { themeScss } from "@theme";
import InputAdornment from '@mui/material/InputAdornment';

interface CustomAutoCompleteProps {
  id: string;
  name: string;
  control?: Control<any>;
  rules?: object;
  value: any;
  onChange: (newValue: any) => void;
  options: any[] | null;
  label: string;
  error?: boolean;
  helperText?: any;
  placeholder?: string;
  startIcon?: React.ReactNode;
} 

const CustomAutoComplete: FC<CustomAutoCompleteProps> = ({
  id,
  name,
  control,
  rules,
  value,
  onChange,
  options,
  label,
  error,
  helperText,
  placeholder,
  startIcon 
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Autocomplete
            {...field}
            id={`${id}_input`}
            options={options || []}
            getOptionLabel={(option) => option.description || option.name || ''}
            value={value}
            onChange={(event, newValue) => {
              onChange(newValue);
              field.onChange(newValue);
            }}
            renderInput={(params) => (
              <>
                <Typography id={`${id}_label`} variant="body1">
                  {label}
                </Typography>
                <TextField
                  {...params}
                  placeholder={placeholder}
                  error={error}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: startIcon ? (
                      <InputAdornment position="start">
                        {startIcon}
                      </InputAdornment>
                    ) : params.InputProps?.startAdornment
                  }}
                />
              </>
            )}
            sx={{
              marginTop: '16px'
            }}
          />
          {helperText && <FormHelperText id={`${id}_helper_text`} sx={{
            color: themeScss.color.error
          }}>
            {helperText}
          </FormHelperText>}

        </Box>
      )}
    />
  );
}

export default CustomAutoComplete;