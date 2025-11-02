import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams, useNavigate, useMatch } from "react-router-dom";
import { Stepper, Step, StepLabel, Box, Typography, Button } from "@mui/material";

import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import TuneIcon from '@mui/icons-material/Tune';
import ChairIcon from '@mui/icons-material/Chair';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import DescriptionTab from "./DescriptionTab";
import "./Pricing.scss";
import RootLayout from "@components/Layout";
import FactorsTab from "./FactorsTab";
import OptionalTab from "./OptionalTab";
import ConclusionTab from "./ConclusionTab";
import ParametrosIATab from "./ParametrosIATab";
import dayjs from "dayjs";
import CalculationIA from "./CalculationIA";
import SearchTravel from "./SearchTravel";
import { toast } from "react-toastify";
import SeatCalculationPanel from "./SeatCalculationPanel";
import PageLoader from "@components/PageLoader";
import { useStepper } from "@providers/StepperProvider";

import { PricingHistoryService } from "@utils/services/api/pricingHistory";
import { AgencyType, Category, Line, PricingStatus, RoutePoints, Service } from "@utils/entities";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

import Routes from "@routes/paths";

const steps = [
    { label: "Parâmetros da IA", icon: <SmartToyIcon />, component: <ParametrosIATab /> },
    { label: "Viagens Disponiveís", icon: <TravelExploreIcon />, component: <SearchTravel /> },
    { label: "Cálculo Inteligente", icon: <SmartToyIcon />, component: <CalculationIA /> },
    { label: "Descrição", icon: <DescriptionIcon />, component: <DescriptionTab /> },
    { label: "Fatores de Influência", icon: <AccountTreeRoundedIcon />, component: <FactorsTab /> },
    { label: "Opcionais", icon: <TuneIcon />, component: <OptionalTab /> },
    { label: "Cálculo de Poltronas", icon: <ChairIcon />, component: <SeatCalculationPanel /> },
    { label: "Conclusão", icon: <CheckCircleIcon />, component: <ConclusionTab /> },
];


interface IFormInput {
    conclusion: {
        calculationIA: {
            line: Line;
            forecastDate: any[];
            timePurchase: [{ value: string; description: string; start: number, end: number }];
            itineraries: RoutePoints[];
        },
        description: string;
        purchaseDates: any[];
        optionalDetails: {
            categories: Category[];
            agencies: AgencyType[];
        },
        services: Service[];
        servicesEnd: Service[];
        selectedServices: Service[];
    }
}


function getValidDateRange(periods: any[]) {
    const validDates: Date[] = [];

    for (const period of periods) {
        const selectedDayIds = period.days.map((d: any) => parseInt(d.id, 10));
        let start = dayjs(period.startDate).startOf('day');
        const end = dayjs(period.endDate).endOf('day');

        while (start.isBefore(end) || start.isSame(end, 'day')) {
            const jsDay = start.day();
            if (selectedDayIds.includes(jsDay)) {
                validDates.push(start.toDate());
            }
            start = start.add(1, 'day');
        }
    }

    if (validDates.length === 0) {
        return { firstDate: null, lastDate: null };
    }

    validDates.sort((a, b) => a.getTime() - b.getTime());

    return {
        firstDate: validDates[0],
        lastDate: validDates[validDates.length - 1]
    };
}

export default function PricingIAScreen() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = useMatch("/precificacao/:id/edit");
    const isDuplicate = useMatch("/precificacao/:id/duplicate");
    const [formData, setFormData] = useState<Partial<IFormInput>>({});
    const [activeStep, setActiveStep] = useState<number>(0);
    const { loading } = useStepper();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const formattedDate = dayjs().format('DD-MM-YYYY');

    const methods = useForm<IFormInput>({
        mode: "onBlur",
        defaultValues: {
            conclusion: {
                calculationIA: {
                    line: null,
                    forecastDate: [],
                    timePurchase:  [],
                    itineraries: []
                },
                description: null,
                purchaseDates: [],
                optionalDetails: {
                    categories: [],
                    agencies: []
                },
                services: [],
                servicesEnd: [],
                selectedServices: []
            }
        },
    });

    const { reset } = methods;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await PricingHistoryService.getOne(id);
                reset({
                    conclusion: {
                        calculationIA: {
                            line: data.line,
                            forecastDate: data.forecastDate,
                            timePurchase: data.timePurchase,
                            itineraries: data.itineraries
                        },
                        description: isDuplicate ? `${data.description} (Duplicado em ${formattedDate})` : data.description,
                        purchaseDates: data.purchaseDates,
                        optionalDetails: data.optionalDetails,
                        services: [],
                        servicesEnd: [],
                        selectedServices: data.servicesEnd
                    }
                });

                setIsLoading(false);
            } catch (error) {

                setIsLoading(false);
                toast.error(error.response.data.message);
            }
        };
        if (id) fetchData();

    }, []);


    const { handleSubmit, trigger, getValues } = methods;

    const saveHistory = async () => {
        try {
            const purchaseDates = formData.conclusion.purchaseDates;
            const { firstDate, lastDate } = getValidDateRange(purchaseDates);

            let dataHistory = {
                description: formData.conclusion.description,
                lineId: formData.conclusion.calculationIA.line.id,
                line: formData.conclusion.calculationIA.line,
                timePurchase: formData.conclusion.calculationIA.timePurchase,
                itineraries: formData.conclusion.calculationIA.itineraries,
                forecastDate: formData.conclusion.calculationIA.forecastDate,
                purchaseDates: formData.conclusion.purchaseDates,
                optionalDetails: formData.conclusion.optionalDetails,
                servicesEnd: formData.conclusion.servicesEnd,
                status: PricingStatus.PENDING_APPROVAL,
                activationDate: firstDate,
                expiresAt: lastDate,
            }
            if (isEdit) {
                await PricingHistoryService.update({ ...dataHistory, id });
                toast.success('Precificação atualizada com sucesso!');
            } else {
                await PricingHistoryService.create(dataHistory);
                toast.success('Nova Precificação salva com sucesso!');
            }
            navigate(Routes.precificacao.list, { replace: true });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Erro inesperado ao salvar.");
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

    return (
        <RootLayout>
            <div className="pricing-ia" id="pricing-ia">
                <Typography id="pricing-ia__title" variant="subtitle1">
                    Precificação
                </Typography>
                {isLoading ? <PageLoader id="pricing-ia__page-loader" /> :
                    <FormProvider {...methods}>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit(saveHistory)}
                            sx={{
                                margin: '1em auto'
                            }}>
                            <Box sx={{ width: '100%', overflow: 'auto' }}>
                                <Stepper activeStep={activeStep} >
                                    {steps.map((step, index) => (
                                        <Step key={index}>
                                            <StepLabel
                                                id={`pricing-ia__step_${index}`}
                                                StepIconComponent={() => (
                                                    <Box aria-label={step.label} className={`step-icon ${index === activeStep ? "active" : ""}`}>
                                                        {step.icon}
                                                    </Box>
                                                )}
                                                className={`step-label ${index === activeStep ? "active" : ""}`}>
                                                {step.label}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                <Box sx={{ margin: '2rem 0' }} >{steps[activeStep].component}</Box>
                                <Box className="pricing-ia__buttons" sx={{ display: 'flex', justifyContent: 'flex-end', pb: 2 }}>
                                    {activeStep !== 0 && (
                                        <Button id={`pricing-ia__button-back`} onClick={handleBack}>Voltar</Button>
                                    )}
                                    {activeStep === steps.length - 1 ? (
                                        <Button id={`pricing-ia__button-end`} onClick={saveHistory}>Finalizar</Button>
                                    ) : (
                                        <Button id={`pricing-ia__button-next`} onClick={handleNext} disabled={loading}>Próximo</Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </FormProvider>}
            </div>

        </RootLayout>
    );
}
