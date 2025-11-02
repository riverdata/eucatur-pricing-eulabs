
import { useEffect, useState } from "react";
import CustomInput from "@components/CustomInput";
import { get, useFormContext } from "react-hook-form";
import { Box } from "@mui/material";

export default function DescriptionTab() {
    const {
        register,
        formState: { errors },
        setValue,
        getValues
    } = useFormContext();

    const [selectedDescription, setSelectedDescription] = useState<string>("");
   
    useEffect(() => {
        const description = getValues("conclusion.description");
        setSelectedDescription(description);
        setValue("conclusion.description", description);
    }, []);

    return (
        <Box sx={{ width: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CustomInput
                id="description-tab__description"
                name="conclusion.description"
                label="Nome da regra *"
                placeholder="Digite o nome da regra de precificação"
                defaultValue={selectedDescription}
                register={register}
                validation={{
                    required: "A descrição é obrigatória."
                }}
                error={get(errors, "'conclusion.description'")}
                helperText={get(errors, "conclusion.description.message")}
            />
        </Box>
    );
}
