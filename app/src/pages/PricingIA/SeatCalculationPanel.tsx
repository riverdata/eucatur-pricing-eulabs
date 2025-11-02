import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Service } from "@utils/entities";
import PageLoader from "@components/PageLoader";
import { useFetchPrices } from "@hooks/useFetchPricesIA";
import CustomSeatsAccordion from "@components/CustomSeatsAccordion";
import { Box, Typography } from "@mui/material";

export default function SeatCalculationPanel() {
    const {
        setValue,
        getValues
    } = useFormContext();

    const [data, setData] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { fetchPricesSeatsIA } = useFetchPrices();

    useEffect(() => {
        let conclusion = getValues("conclusion")
        const fetchData = async () => {

            try {
                setIsLoading(true);

                let dataSeats: Service[] = await fetchPricesSeatsIA(conclusion.servicesEnd);
                setData(dataSeats);

                setValue("conclusion.servicesEnd", dataSeats);

                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };

        fetchData();

    }, []);

    return (
        <>
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: 2,
                    borderRadius: 2,
                    mb: 2
                }}
            >
                <Typography
                    id={`SeatCalculationPanel_description`}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: 'text.primary'

                    }}
                >
                    <span id={`SeatCalculationPanel_description_section`}>Seção destinada à realização dos cálculos de precificação, após ajustes dos fatores e das porcentagens individuais de cada poltrona.</span>
                    <span id={`SeatCalculationPanel_description_alert`}><strong>Observação:</strong> Quanto mais dias selecionados, maior será o tempo necessário para receber as respostas.</span>

                </Typography>
            </Box>
            {data.length > 0 ? <CustomSeatsAccordion id={`SeatCalculationPanel`} services={data} seatUpdate={false} /> : <PageLoader />}
        </>
    );
};
