import React, { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import {
  Box,
  Button,
  Stepper,
  StepLabel,
  Step
} from '@mui/material';
import RootLayout from "@components/Layout";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import ParametersSimulator from './ParametersSimulator';
import FactorsTab from './FactorsTab';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import CalculationSimulator from './CalculationSimulator';
import ProgressBar from "@components/ProgressBar";
import "./Simulator.scss";

import { Line, Origin, Destination, Service } from '@utils/entities';
import { PricingService } from '@utils/services/api/precificacao';
import { useFetchPrices } from '@hooks/useFetchPricesIA';
import { useFetchFactors } from '@hooks/useFetchFactors';

interface IFormInput {
  conclusion: {
    line: Line;
    origin: Origin;
    destination: Destination;
    timePurchase: string;
    daysAdvance: string;
    dateForecast: string;
    services: Service[],
    servicesEnd: Service[],
    selectedRows: Service[]
  }
}

const steps = [
  { label: "Parâmetros da IA", icon: <SmartToyIcon /> },
  { label: "Cálculo Inteligente", icon: <SmartToyIcon /> },
  { label: "Fatores de Influência", icon: <AccountTreeRoundedIcon /> }
];

export default function PricingSimulatorScreen() {
  const methods = useForm<IFormInput>({
    mode: "onBlur",
    defaultValues: {
      conclusion: {
        line: null,
        timePurchase: "12",
        dateForecast: dayjs().format("YYYY-MM-DD"),
        daysAdvance: "7",
        origin: null,
        destination: null,
        services: [],
        servicesEnd: [],
        selectedRows: []
      }
    }
  });

  const { register, control, handleSubmit, trigger, getValues, setValue, watch, formState: { errors } } = methods;
  const selectedRows = watch("conclusion.selectedRows");

  const { fetchPricesSeatsIA } = useFetchPrices();
  const { fetchFactors } = useFetchFactors();

  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const [formData, setFormData] = useState<Partial<IFormInput>>({});

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {

      const isValid = await trigger();
      if (selectedRows.length === 0) {
        toast.error("Você precisa selecionar pelo menos um horário na tabela.");
        return;
      }
      if (isValid) {
        setIsLoadingForm(true);
        setProgress(0);

        let servicesSelected = [...selectedRows];

        let totalServices = servicesSelected.length;
        setTotalSteps(totalServices);

        let currentStep = 0;
        for (let i = 0; i < servicesSelected.length; i++) {
          const element = servicesSelected[i];

          const newPriceEnd = [];

          const response = await PricingService.precision({
            line: element.line,
            dateForecast: element.service_departure_date,
            timePurchase: Number(data.conclusion.timePurchase),
            daysAdvance: Number(data.conclusion.daysAdvance),
            origin: `${element.price.secctional_origin_code} - ${element.price.secctional_origin_description}`,
            destination: `${element.price.secctional_destiny_code} - ${element.price.secctional_destiny_description}`,
            tariff_value: Number(element.price.amount),
            route_km: Number(element.price.route_km)
          })

          newPriceEnd.push({
            precision: response.data
          });
          currentStep++;
          setProgress(Math.round((currentStep / totalServices) * 100));
          servicesSelected[i].priceEnd = newPriceEnd;
        }

        const { setupFactors } = await fetchFactors(servicesSelected);

        let pricingData = await fetchPricesSeatsIA(setupFactors);
        setValue("conclusion.servicesEnd", pricingData);

        toast.success("Cálculo concluído com sucesso!");
        handleNext();
      } else {
        toast.error("Existem erros no formulário!");
      }
    } catch (error) {
      toast.error("Erro ao calcular!");
    } finally {
      setValue('conclusion.selectedRows', []);
      setIsLoadingForm(false);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      const currentData = getValues();
      setFormData({ ...formData, ...currentData });
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ParametersSimulator />;
      case 1:
        return <CalculationSimulator />;
      case 2:
        return <FactorsTab />;
      default:
        return null;
    }
  };

  return (
    <RootLayout>
      <div id="pricing-simulator" className="pricing-simulator">
        <FormProvider {...methods}>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              margin: '0 auto',
              padding: '20px',
              borderRadius: '8px',
            }}>
            <Box sx={{ width: '100%', overflow: 'auto' }}>
              <Stepper activeStep={activeStep} >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel
                      id={`pricing-simulator__step-${index}`}
                      StepIconComponent={() => (
                        <div className={`step-icon ${index === activeStep ? "active" : ""}`}>
                          {step.icon}
                        </div>
                      )}
                      className={`step-label ${index === activeStep ? "active" : ""}`}>
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ margin: '2rem 0' }} >{renderStepContent(activeStep)}
                {isLoadingForm && totalSteps > 0 && (
                  <ProgressBar id="pricing-simulator__progress-bar" value={progress} label="Calculando precificação..." />
                )}
              </Box>
              <Box className="pricing-simulator__buttons" sx={{ display: 'flex', justifyContent: 'flex-end', pb: 2 }}>
                {activeStep !== 0 && (
                  <Button id={`pricing-simulator__button-back`} onClick={handleBack}>Voltar</Button>
                )}
                {activeStep === 0 && (
                  <Button id={`pricing-simulator__button-end`} type="submit">Calcular Precificação</Button>
                )}
                {(activeStep > 0 && activeStep < steps.length - 1) && (
                  <Button id={`pricing-simulator__button-next`} onClick={handleNext}>Próximo</Button>
                )}
              </Box>
            </Box>
          </Box>
        </FormProvider>

      </div>

    </RootLayout>

  );
}
