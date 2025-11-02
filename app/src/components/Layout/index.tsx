import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import Navbar from "./Navbar";
import { useThemeProvider } from "@providers/ThemeProvider";
import BasicRoutes from "./BasicRoutes";
import './Layout.scss';

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  const { expanded } = useThemeProvider();

  return (
    <div className="layout">
      <Navbar />

      <Sidebar />
      <div className={`layout__container layout__container${expanded == 'true' ? '-is-active' : '-is-inactive'}`}>
        <BasicRoutes />
        <div className="container">
          {children}
        </div>

      </div>
    </div >
  );
}
