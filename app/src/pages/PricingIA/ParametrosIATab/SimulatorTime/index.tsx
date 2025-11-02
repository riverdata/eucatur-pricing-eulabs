import { useFormContext, Controller, useFieldArray, get } from "react-hook-form";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  Typography
} from "@mui/material";

import Grid2 from "@mui/material/Grid2";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { themeScss } from "@theme";
import { useState } from "react";
import { GifBox } from "@mui/icons-material";

const periodOptions = [
  { value: "madrugada", description: "Madrugada (00h - 05h)", start: 0, end: 5 },
  { value: "manha", description: "Manhã (06h - 11h)", start: 6, end: 11 },
  { value: "tarde", description: "Tarde (12h - 17h)", start: 12, end: 17 },
  { value: "noite", description: "Noite (18h - 23h)", start: 18, end: 23 }
];

const timePeriodValidation = {
  required: "O período da compra é obrigatório.",
};

export default function SimulatorTime() {
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();

  const selectedServices = watch("conclusion.services") || [];
  const timePurchase = watch("conclusion.calculationIA.timePurchase") || [];

  const error = get(errors, "conclusion.calculationIA.timePurchase");

  const handleFixedToggle = (option: typeof periodOptions[number]) => {
    const alreadySelected = timePurchase.some(p => p.value === option.value);

    const updated = alreadySelected
      ? timePurchase.filter(p => p.value !== option.value)
      : [...timePurchase, option];

    setValue("conclusion.calculationIA.timePurchase", updated, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleAddCustomPeriod = (start: number, end: number) => {
    if (start >= 0 && end <= 23 && end > start) {
      const newIndex = timePurchase.filter(p => p.value.startsWith("custom")).length + 1;
      const newPeriod = {
        value: `custom-${newIndex}`,
        description: `Personalizado (${String(start).padStart(2, "0")}h - ${String(end).padStart(2, "0")}h)`,
        start,
        end
      };
      setValue("conclusion.calculationIA.timePurchase", [...timePurchase, newPeriod], {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  };

  const handleRemove = (value: string) => {
    const updated = timePurchase.filter(p => p.value !== value);
    setValue("conclusion.calculationIA.timePurchase", updated, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const [newStart, setNewStart] = useState<number | "">("");
  const [newEnd, setNewEnd] = useState<number | "">("");

  return (
    <>
      {selectedServices.length > 0 && (
        <FormControl component="fieldset" error={!!error} sx={{ gap: 4, display: "flex", alignItems: "start", justifyContent: 'space-evenly', mb: 1, flexDirection: { xs: "column", sm: "row" } }}>
          <Box>
            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon sx={{ mr: 1, color: themeScss.color.primary }} />
              Em qual período do dia?
            </Typography>

            <FormGroup>
              {periodOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={timePurchase.some(p => p.value === option.value)}
                      onChange={() => handleFixedToggle(option)}
                    />
                  }
                  label={option.description}
                />
              ))}
            </FormGroup>

          </Box>

          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Ou informe períodos específicos:
            </Typography>

            {timePurchase
              .filter(p => p.value.startsWith("custom"))
              .map((p) => (
                <Grid2 container spacing={2} alignItems="center" key={p.value} sx={{ mb: 1 }}>
                  <Grid2>
                    <TextField
                      label="Período"
                      value={p.description}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid2>
                  <Grid2>
                    <IconButton color="error" onClick={() => handleRemove(p.value)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid2>
                </Grid2>
              ))}

            <Grid2 container spacing={2} alignItems="center" sx={{ mt: 2 }}>
              <Grid2>
                <TextField
                  label="De (hora)"
                  type="number"
                  fullWidth
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value === "" ? "" : Number(e.target.value))}
                  inputProps={{ min: 0, max: 23 }}
                />
              </Grid2>
              <Grid2>
                <TextField
                  label="Até (hora)"
                  type="number"
                  fullWidth
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value === "" ? "" : Number(e.target.value))}
                  inputProps={{ min: 0, max: 23 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (typeof newStart === "number" && typeof newEnd === "number") {
                        handleAddCustomPeriod(newStart, newEnd);
                        setNewStart("");
                        setNewEnd("");
                      }
                    }
                  }}
                />
              </Grid2>
              <Grid2>
                <IconButton
                  color="primary"
                  onClick={() => {
                    if (typeof newStart === "number" && typeof newEnd === "number") {
                      handleAddCustomPeriod(newStart, newEnd);
                      setNewStart("");
                      setNewEnd("");
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Grid2>
            </Grid2>
          </Box>
        </FormControl>
      )}
    </>
  );
}
