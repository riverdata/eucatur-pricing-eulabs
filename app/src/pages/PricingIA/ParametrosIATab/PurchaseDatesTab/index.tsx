import { useState } from "react";
import { Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";
import CustomFrequencies from "@components/CustomFrequencies";
import { Box, Typography } from "@mui/material";

interface ISelectDay {
    id: string;
    name: string;
    description: string;
}

interface IFrequency {
    id: string;
    days: ISelectDay[];
    startDate: Dayjs;
    endDate: Dayjs;
    status?: string;
}

export default function PurchaseDatesTab() {
    const {
        setValue,
        getValues
    } = useFormContext();

    const [data, setData] = useState<IFrequency[]>(getValues("conclusion.purchaseDates"));

    const handleUpdateForm = (updatedData: IFrequency[]) => {
        setData(updatedData);
        setValue("conclusion.purchaseDates", updatedData);
    };

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
                    id={`purchase-dates__description`}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: 'text.primary'

                    }}
                >
                    <span id={`purchase-dates__description_section`}>Permite configurar os períodos de início e término em que os preços definidos serão aplicados.</span>
                </Typography>
            </Box>
            <CustomFrequencies dataFrequency={data} handleUpdateForm={handleUpdateForm} />
        </>
    );
};
