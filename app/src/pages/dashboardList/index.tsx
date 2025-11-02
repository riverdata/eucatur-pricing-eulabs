
import RootLayout from "@components/Layout";
import { Typography } from "@mui/material";
import './DashboardList.scss';

export default function DashboardListScreen() {
  return (
    <RootLayout>
      <div className="dashboard" id="dashboardlist">

        <Typography id="dashboardlist_title" variant="subtitle1">
          Dashboard
        </Typography>
        Conteudo
      </div>
    </RootLayout>
  );
}

