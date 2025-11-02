import { useState, FC } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { LocalizationProvider, MobileDatePicker, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Typography } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { themeScss } from "@theme";

const calcularPascoa = (ano: number) => {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;

  return dayjs(`${ano}-${mes}-${dia}`);
};

const feriadosFixos = new Set([
  "01-01",
  "21-04",
  "01-05",
  "07-09",
  "12-10",
  "02-11",
  "15-11",
  "25-12"
]);

const feriadosSPFixos = new Set([
  "01-25",
  "07-09"
]);

export const calcularFeriadosMoveis = (data: Dayjs) => {
  const pascoa = calcularPascoa(Number(data.format("YYYY")));
  const feriados = {
    carnaval: pascoa.subtract(47, "day").format("YYYY-MM-DD"),
    sextaSanta: pascoa.subtract(2, "day").format("YYYY-MM-DD"),
    pascoa: pascoa.format("YYYY-MM-DD"),
    corpusChristi: pascoa.add(60, "day").format("YYYY-MM-DD"),
  }

  return feriados.carnaval === data.format("YYYY-MM-DD") ||
    feriados.sextaSanta === data.format("YYYY-MM-DD") ||
    feriados.pascoa === data.format("YYYY-MM-DD") ||
    feriados.corpusChristi === data.format("YYYY-MM-DD") ||
    feriadosFixos.has(data.format("DD-MM")) || feriadosSPFixos.has(data.format("DD-MM"));
};

const CustomPickersDay = (props: PickersDayProps<Dayjs>) => {
  const { day, outsideCurrentMonth, ...other } = props;
  const isFeriado = calcularFeriadosMoveis(day);

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        backgroundColor: isFeriado ? "#FFEBEE" : "inherit",
        color: isFeriado ? "red" : "inherit",
        fontWeight: isFeriado ? "bold" : "normal",
        border: isFeriado ? "2px solid red" : "none",
      }}
    />
  );
};

interface CalendarWithHolidaysProps {
  id: string;
  name: string;
  label: string;
  onChange: (newValue: any) => void;
  value: any;
  minDate?: Dayjs;
  datasLiberadas?: Dayjs[];
}

const CalendarWithHolidays: FC<CalendarWithHolidaysProps> = ({
  id,
  name,
  label,
  onChange,
  value,
  minDate = dayjs(),
  datasLiberadas = []
}) => {

  const shouldDisableDate = (date: Dayjs) => {
    if (datasLiberadas.length === 0) {
      return false;
    }
    return !datasLiberadas.some((allowedDate) => date.isSame(allowedDate, "day"));
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Typography id={`${id}_label`} variant="body1">
          {label}
        </Typography>
        <MobileDatePicker
          format="DD/MM/YYYY"
          minDate={minDate}
          value={value}
          onChange={onChange}
          shouldDisableDate={shouldDisableDate}
          slots={{ day: CustomPickersDay }}
          slotProps={{
            textField: {
              required: true,
              id: `${id}_input`,
              name: `${name}`,
              InputProps: {
                startAdornment: (
                  <CalendarMonthIcon sx={{ color: themeScss.color.primary }} />
                ),
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarWithHolidays;
