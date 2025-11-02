import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Box, Typography, Button, ButtonGroup, TablePagination } from "@mui/material";
import { toast } from "react-toastify";
import CustomSeatsAccordion from "@components/CustomSeatsAccordion";
import dayjs from "dayjs";
import ProgressBar from "@components/ProgressBar";

import { Service } from "@utils/entities";
import { PricingService } from "@utils/services/api/precificacao";
import { useStepper } from "@providers/StepperProvider";
import { useFetchFactors } from "@hooks/useFetchFactors";

function getValidDateRange(periods: any[], serviceDepartureDate: string): number[] {
    const validDates: number[] = [];
    const departureDate = dayjs(serviceDepartureDate).startOf("day");
    const today = dayjs().startOf("day");

    if (departureDate.isBefore(today)) return [];

    for (const period of periods) {
        const selectedDayIds = period.days.map((d: any) => parseInt(d.id, 10));
        let start = dayjs(period.startDate).startOf("day");
        const end = dayjs(period.endDate).endOf("day");

        while (start.isBefore(end) || start.isSame(end, "day")) {
            const jsDay = start.day();
            if (selectedDayIds.includes(jsDay)) {
                const diff = departureDate.diff(start, "day");
                if (diff > 0 && diff <= 15) {
                    validDates.push(diff);
                }
            }
            start = start.add(1, "day");
        }
    }

    return validDates;
}

function getPageNumbers(currentPage: number, totalPages: number, maxButtons: number = 5) {
    let start = Math.max(0, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(0, end - maxButtons);
    }

    const pages = [];
    for (let i = start; i < end; i++) {
        pages.push(i);
    }
    return pages;
}

export default function CalculationIA() {
    const {
        setValue,
        getValues,
        watch
    } = useFormContext();

    const { fetchFactors } = useFetchFactors();
    const { setLoading } = useStepper();

    const selectedServices: Service[] = watch("conclusion.selectedServices") || [];
    const [servicesEnd, setServicesEnd] = useState<Service[]>([]);
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [calculationFinished, setCalculationFinished] = useState(false);
    const [progress, setProgress] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const currentPageRows = servicesEnd.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const Calculation = async () => {
        if (selectedServices.length === 0) {
            toast.warn("Você precisa selecionar pelo menos um horário na tabela.");
            return;
        }

        if (selectedServices.length > 5) {
            toast.warn("Para evitar lentidão, recomenda-se selecionar no máximo 5 horários.");
        }

        try {
            setIsLoadingForm(true);
            setProgress(0);

            const purchaseDates = getValues("conclusion.purchaseDates");
            const timePurchase = getValues("conclusion.calculationIA.timePurchase");

            let total = 0;
            for (const element of selectedServices) {
                const daysAdvance = getValidDateRange(purchaseDates, element.service_departure_date);
                for (const day of daysAdvance) {
                    for (const time of timePurchase) {
                        total += time.end - time.start + 1;
                    }
                }
            }
            setTotalSteps(total);

            let stepCount = 0;
            const updatedServices: Service[] = [];

            for (const element of selectedServices) {
                const daysAdvance = getValidDateRange(purchaseDates, element.service_departure_date);
                const newPriceEnd = [];
                
                for (const daysBefore of daysAdvance) {
                    for (const time of timePurchase) {
                        for (let hour = time.start; hour <= time.end; hour++) {
                            const response = await PricingService.precision({
                                line: element.line,
                                dateForecast: element.service_departure_date,
                                timePurchase: hour,
                                daysAdvance: daysBefore,
                                origin: `${element.price.secctional_origin_code} - ${element.price.secctional_origin_description}`,
                                destination: `${element.price.secctional_destiny_code} - ${element.price.secctional_destiny_description}`,
                                tariff_value: Number(element.price.amount),
                                route_km: Number(element.price.route_km)
                            });

                            newPriceEnd.push({ precision: response.data });

                            stepCount++;
                            if (total > 0) {
                                setProgress(Math.round((stepCount / total) * 100));
                            }
                        }
                    }
                }

                if (newPriceEnd.length > 0) {
                    updatedServices.push({ ...element, priceEnd: newPriceEnd });
                }
            }

            if (updatedServices.length > 0) {
                const { setupFactors } = await fetchFactors(updatedServices);
                setValue("conclusion.servicesEnd", setupFactors);
                setServicesEnd(setupFactors);
                toast.success("Cálculo concluído com sucesso!");
            } else {
                toast.error("Nenhuma viagem satisfaz aos critérios de cálculos!");
            }

        } catch (error) {
            toast.error("Erro ao calcular!");
        } finally {
            setIsLoadingForm(false);
            setLoading(false);
            setCalculationFinished(true);
        }
    };

    useEffect(() => {
        if (selectedServices?.length > 0) {
            setLoading(true);
            Calculation();
        }
    }, [selectedServices]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box id="calculation-ia" sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2, mb: 2 }}>
                <Typography
                    id={`calculation-ia__description`}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "text.primary"
                    }}
                >
                    <span id={`calculation-ia__description-section`}>
                        <strong>Aguarde a finalização do Cálculo da IA</strong>
                    </span>
                </Typography>
            </Box>

            {isLoadingForm && totalSteps > 0 ? (
                <ProgressBar id="calculation-ia__progress-bar" value={progress} label="Calculando precificação..." />
            ) : calculationFinished && servicesEnd.length === 0 ? (
                <Typography variant="subtitle2" sx={{ display: "flex", justifyContent: "center" }}>
                    Não há dados disponíveis
                </Typography>
            ) : (
                calculationFinished && servicesEnd.length > 0 && (
                    <>
                        <CustomSeatsAccordion
                            id={`calculation-ia`}
                            services={currentPageRows}
                            seatUpdate={false}
                            view={false}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>

                            <TablePagination
                                component="div"
                                count={servicesEnd.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                labelRowsPerPage="Serviços por página"
                                showFirstButton
                                showLastButton
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                <ButtonGroup variant="outlined" size="small" aria-label="pagination">
                                    {getPageNumbers(page, Math.ceil(servicesEnd.length / rowsPerPage)).map((pageNum) => (
                                        <Button
                                            key={pageNum}
                                            variant={pageNum === page ? 'contained' : 'outlined'}
                                            onClick={() => setPage(pageNum)}
                                        >
                                            {pageNum + 1}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </Box>
                        </Box>


                    </>
                )
            )}
        </Box>
    );
}
