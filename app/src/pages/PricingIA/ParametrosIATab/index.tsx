
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Box } from "@mui/material";
import SimulatorLines from "./SimulatorLines";
import SimulatorTime from "./SimulatorTime";
import CustomTabPanels from "@components/CustomTabPanels";
import Frequencies from "./Frequencies";
import ItinerariesPainel from "./ItinerariesPanel";
import PurchaseDatesTab from "./PurchaseDatesTab";


export default function ParametrosIATab() {
    const {
        formState: { errors },
        trigger
    } = useFormContext();

    const [tabs, setTabs] = useState<any[]>([]);
    useEffect(() => {
        setTabs([
            {
                label: 'Linha', content: <SimulatorLines />
            },
            {
                label: 'Datas - precificação', content: <Frequencies />
            },
            {
                label: 'Horario Compra', content: <SimulatorTime />
            },
            {
                label: 'Frequencia - venda', content: <PurchaseDatesTab />
            },
            {
                label: 'Itinerários', content: <ItinerariesPainel />
            }
        ])
    }, []);

    return (
        <Box id="parametros-ia" sx={{ pl: 1, pr: 1 }} >
            {/* <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: 2,
                    borderRadius: 2,
                    mb: 2
                }}
            >
                <Typography
                    id={`FactorsTab_description`}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: 'text.primary'

                    }}
                >
                    <span>Seção destinada à revisão e edição dos parâmetros utilizados no processo de precificação realizado pela Inteligência Artificial.</span>
                </Typography>
            </Box> */}
            <CustomTabPanels id="parametros-ia__tab-panels" tabs={tabs} trigger={trigger} disabled={true} />
        </Box>
    );
}
