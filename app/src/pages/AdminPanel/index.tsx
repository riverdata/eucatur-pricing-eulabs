
import RootLayout from "@components/Layout";
import { Typography } from "@mui/material";
import './AdminPanel.scss';

import CustomTabPanels from "@components/CustomTabPanels";
import SyncLines from "./SyncLines";
import { useForm } from "react-hook-form";
import SyncCategory from "./SyncCategory";
import SyncAgency from "./SyncAgency";


export default function AdminPanelScreen() {

  const methods = useForm({
    mode: "onBlur",
  });

  const { trigger } = methods;

  
  const tabs = [
    {
      label: 'Linhas', content: <SyncLines />
    },
    {
      label: 'Categorias', content: <SyncCategory />
    },
    {
      label: 'Agências', content: <SyncAgency />
    }
  ];

  return (
    <RootLayout>
      <div className="adminpainel" id="adminpainel">

        <Typography id="adminpainel_title" variant="subtitle1">
          Painel Administrativo
        </Typography>
          <CustomTabPanels id="AdminPainel" tabs={tabs} trigger={trigger}/>
      </div>
    </RootLayout>
  );
}

