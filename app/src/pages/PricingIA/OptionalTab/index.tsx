import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import CategoriesPainel from "./CategoriesPainel";
import AgenciesPainel from "./AgenciesPainel";
import SeatsPainel from "./SeatsPainel";
import CustomTabPanels from "@components/CustomTabPanels";

export default function OptionalTab() {
  const {
    formState: { errors },
    trigger
  } = useFormContext();

  const [tabs, setTabs] = useState<any[]>([]);

  useEffect(() => {
    setTabs([
      {
        label: 'Poltronas', content: <SeatsPainel />
      },
      {
        label: 'Agências', content: <AgenciesPainel />
      },
      {
        label: 'Categorias', content: <CategoriesPainel />
      }
    ])
  }, []);


  return (
    <Box id="optional-tab" sx={{ pl: 1, pr: 1 }} >
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 2,
          mb: 2
        }}
      >
        <Typography
          id="optional-tab__description"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'text.primary'

          }}
        >
          <span id="optional-tab__description_section">Seção destinada à revisão e edição dos opcionais, incluindo categorias, frequências de viagem, assentos e demais configurações relacionadas.</span>
          <span id="optional-tab__description_info">Na opção de poltronas, é possível aplicar um desconto ou acréscimo ao valor da poltrona, com base na tarifa base.</span>

        </Typography>
      </Box>
      <CustomTabPanels id="optional-tab__tab-panels" tabs={tabs} trigger={trigger} />
    </Box >
  );
};

