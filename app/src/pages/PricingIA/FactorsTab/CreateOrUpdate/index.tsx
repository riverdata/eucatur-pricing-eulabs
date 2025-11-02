import { useEffect, useState, FC } from 'react';
import { Typography, Box, Slider, Button } from '@mui/material';
import CustomAutoComplete from '@components/CustomAutoComplete';
import Grid from '@mui/material/Grid2';
import { useFormContext } from 'react-hook-form';
import CustomModal from '@components/CustomModal';
import { FactorIA, IFactorAddIA, Price, Service } from '@utils/entities';
import { toast } from 'react-toastify';
import { useFetchFactors } from '@hooks/useFetchFactors';
import dayjs from 'dayjs';

const CreateOrUpdateModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    serviceId: string,
    editingPriceIndex: number,
    editingPrice: Price
  ) => void;
  dataUpdate: {
    serviceId: string,
    editingPriceIndex: number,
    editingPrice: Price
  };
}> = ({ isOpen, onClose, onConfirm, dataUpdate }) => {

  const {
    register,
    control,
    formState: { errors }
  } = useFormContext();

  const [selectedData, setSelectedData] = useState<FactorIA | null>(null);
  const [data, setData] = useState<FactorIA[]>([]);
  const [dataService, setDataService] = useState<{
    serviceId: string,
    editingPriceIndex: number,
    editingPrice: Price
  }>();
  const { calculationFactor } = useFetchFactors();

  useEffect(() => {
    if (!isOpen || !dataUpdate) return;

    setDataService(dataUpdate);
    setData([dataUpdate.editingPrice.factors[1]]);
    setSelectedData(dataUpdate.editingPrice.factors[1]);
  }, [isOpen, dataUpdate]);

  const handleFatorChange = (factor: FactorIA) => {
    setSelectedData(factor)
  };

  const handlePesoFatorAddChange = (itemAdd: IFactorAddIA, newValue: number) => {
    setSelectedData((prevState) => {
      if (!prevState) return prevState;

      const newItemAdd = prevState.factor_weight_add.map((item) =>
        item.id === itemAdd.id ? { ...item, percentage: newValue } : item
      );

      const updated = { ...prevState, factor_weight_add: newItemAdd };

      updateFactors(updated);
      return updated;
    });
  };

  const updateFactors = async (factor: FactorIA) => {
    try {
      if (!dataService) return;
      const updatedFactores = [...dataService.editingPrice.factors];
      const existingIndex = updatedFactores.findIndex(f => f.id === factor.id);
      if (existingIndex >= 0) {
        updatedFactores[existingIndex] = factor;
      } else {
        updatedFactores.push(factor);
      }

      const updatePrice = {
        ...dataService.editingPrice,
        factors: updatedFactores
      }

      const { factorsCalculated } = await calculationFactor(updatePrice);
      setDataService({
        serviceId: dataService.serviceId,
        editingPriceIndex: dataService.editingPriceIndex,
        editingPrice: factorsCalculated
      });

      setData([factorsCalculated.factors[1]]);

      const updatedCurrentFactor = factorsCalculated.factors.find(f => f.id === factor.id);
      if (updatedCurrentFactor) {
        setSelectedData(updatedCurrentFactor);
      }
    } catch (error) {
      toast.error("Erro ao recalcular os fatores");
    }
  };

  const handleSubmitModal = () => {
    if (!dataService) return;

    const updatedPriceEnd = { ...dataService.editingPrice, factors: [...dataService.editingPrice.factors] };

    onConfirm(dataService.serviceId, dataService.editingPriceIndex, updatedPriceEnd);
    setSelectedData(null);
    setDataService(null);
    setData([]);
    onClose();
  };

  const formatHoraCompra = (hora: number): string => {
    return ` ${hora} Hora${hora === 1 ? '' : 's'}`;
  };

  if (!isOpen) return null;

  return (
    <div>
      <CustomModal
        type="FactorIAs"
        isOpen={isOpen}
        title="Ajustes dos Preços das Poltronas"
        onClose={onClose}
      >
        <Grid container spacing={3} sx={{ alignItems: 'baseline' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'space-between',
            gap: 2,
          }}>
            <Box sx={{
              width: '50%',
              alignItems: "center",
            }}>
              <Typography variant="body1" id="modal_factors_date-label">
                Data da Viagem
              </Typography>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  padding: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 50, textAlign: "center" }}>
                  <Typography variant="body1" id="modal_factors_date">
                    {dataService && dayjs(dataService.editingPrice.precision.data_previsao).format('DD-MM-YYYY')}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{
              width: '50%',
              alignItems: "center",
            }}>
              <Typography variant="body1" id="modal_factors_time-label">
                Horário da Compra
              </Typography>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  padding: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 50, textAlign: "center" }}>
                  <Typography variant="body1" id="modal_factors_time">
                    {dataService && formatHoraCompra(dataService.editingPrice.precision.hora_compra)}
                  </Typography>
                </Box>
              </Box>
            </Box>


            {/* <CustomAutoComplete
              id="modal_factors_factor"
              name="factor"
              control={control}
              value={selectedData}
              onChange={(newValue) => handleFatorChange(newValue)}
              options={data}
              label="Selecione um fator *"
              placeholder="Selecione um fator"
            /> */}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'space-between',
            gap: 2,
          }}>
            <Box sx={{
              width: '50%',
              alignItems: "center",
            }}>
              <Typography variant="body1" id="modal_factors_days-label">
                Dias Antecedência
              </Typography>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  padding: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 50, textAlign: "center" }}>
                  <Typography variant="body1" id="modal_factors_days">
                    {dataService && (` ${dataService.editingPrice.precision.dias_antecedencia} Dia(s)`)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{
              width: '50%',
              alignItems: "center",
            }}>
              <Typography variant="body1" id="modal_factors_tariff-label">
                Tarifa Base
              </Typography>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  padding: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 50, textAlign: "center" }}>
                  <Typography variant="body1" id="modal_factors_tariff">
                    {dataService && new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(dataService.editingPrice.precision.tarifa_base)}
                  </Typography>
                </Box>
              </Box>
            </Box>

          </Grid>

        </Grid>
        <Typography id="modal_factors_individual">Preencha os pesos em % dos fatores</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={3} sx={{ alignItems: 'baseline' }}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="body2" fontWeight="bold">Tipo</Typography>
                {selectedData?.id === "1" && (
                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}>
                    <Typography variant="body2" fontWeight="bold">Preço</Typography>
                  </Box>
                )}
                {selectedData?.id !== "1" && (
                  <Typography variant="body2" fontWeight="bold">Porcentagem <br />IA</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          {selectedData?.factor_weight_add.map((item: IFactorAddIA) => (
            <Grid container spacing={3} key={item.id} sx={{ alignItems: 'baseline' }}>
              <Grid size={{ xs: 12, sm: 8 }}>
                {selectedData.id === "1" ?
                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}>
                    <Typography id={`modal_factors_individual-${item.id}`} variant="body1">{item.type.toUpperCase()}</Typography>
                    <Box sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}>
                      <Typography id={`modal_factors_individual-${item.id}`} variant="body1">{new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.value)}</Typography>
                    </Box>

                  </Box>
                  :
                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}>
                    <Typography id={`modal_factors_individual-${item.id}`} variant="body1">{item.type.toUpperCase()}</Typography>
                    <Typography id={`modal_factors_individual_weight-${item.id}`} variant="body1">
                      {Number(item.percentageIA.toFixed(2))}%
                    </Typography>
                  </Box>}

              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    padding: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 50, textAlign: "center" }}>
                    <Typography id={`modal_factors_individual_weight-${item.id}`} variant="body1">
                      {Number(item.percentage.toFixed(2))}%
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Slider
                      aria-labelledby={`slider-${item.id}`}
                      value={item.percentage ?? 0}
                      onChange={(event, value) => handlePesoFatorAddChange(item, value as number)}
                      min={-100}
                      max={100}
                      step={0.01}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', gap: 2, mt: 2 }}>

          <Button
            variant="contained"
            onClick={handleSubmitModal}
            disabled={data && data.length === 0}
          >
            Finalizar Ajustes
          </Button>
        </Box>

      </CustomModal>
    </div >
  );
}


export default CreateOrUpdateModal;