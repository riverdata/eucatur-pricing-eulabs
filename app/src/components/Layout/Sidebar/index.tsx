import { useUserProvider } from "@providers/UserProvider";
import Routes from "@routes/paths";
import { UserRole } from "@utils/entities";
import { StorageService } from "@utils/services/storage";
import { useNavigate } from "react-router-dom";
import { HTMLAttributes, useState } from "react";
import { useThemeProvider } from "@providers/ThemeProvider";
import { Drawer } from "@mui/material";
import Button from '@mui/material/Button';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import logo from '@assets/images/logo_eucatur.svg';
import './Sidebar.scss';
import DomainRoundedIcon from '@mui/icons-material/DomainRounded';

interface SidebarProps extends HTMLAttributes<HTMLDivElement> { }

export function Sidebar(_props: SidebarProps) {
  const navigate = useNavigate();
  const { user, setUser } = useUserProvider();
  const [isVisibleModalSignout, setIsVisibleModalSignout] = useState(false);
  const { expanded } = useThemeProvider();

  const [selectedButton, setSelectedButton] = useState<string>(
    () => localStorage.getItem("selectedButton") ?? "0"
  );

  const [selectedButtonSubMenu, setSelectedButtonSubMenu] = useState<string>(
    () => localStorage.getItem("selectedButtonSubMenu") ?? "0-0"
  );


  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);

  const handleMenuClick = (index: number, hasChildren: boolean, to?: string) => {
    setSelectedButton(index.toString());

    if (hasChildren) {
      setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
    } else if (to) {
      setOpenSubMenuIndex(null);
      navigate(to, { replace: true });
    }
    localStorage.setItem("selectedButton", index.toString());
  };

  const handleSubMenuClick = (menuIndex: number, childIndex: number, to: string) => {
    const subMenuButtonId = `${menuIndex}-${childIndex}`;

    setSelectedButton(menuIndex.toString());
    setSelectedButtonSubMenu(subMenuButtonId);

    navigate(to, { replace: true });
    localStorage.setItem("selectedButton", menuIndex.toString());
    localStorage.setItem("selectedButtonSubMenu", subMenuButtonId);
  };


  const onSubmitLogout = () => async () => {
    StorageService.clear();
    setUser(null);
    navigate(Routes.signIn);
  };

  const admin = [
    {
      title: "Precificação",
      to: Routes.precificacao.list,
      icon: <SpaceDashboardIcon className="list__button-icons" />,
    },
    {
      title: "Simulador",
      to: Routes.simulator.list,
      icon: <LibraryAddOutlinedIcon className="list__button-icons" />,
    },
    {
      title: "Configurações",
      icon: <SettingsOutlinedIcon className="list__button-icons" />,
      children: [
        {
          title: "Usuários",
          to: Routes.user.list,
          icon: <AdminPanelSettingsRoundedIcon className="list__button-icons" />,
        },
        {
          title: "Departamentos",
          to: Routes.department.list,
          icon: <DomainRoundedIcon className="list__button-icons" />,
        }
      ]
    },
    {
      title: "Ajuda",
      to: Routes.dashboard.list,
      icon: <HelpOutlineRoundedIcon className="list__button-icons" />,
    }
  ];

  const menuItems = {
    User: [
      {
        title: "Precificação",
        to: Routes.precificacao.list,
        icon: <SpaceDashboardIcon className="list__button-icons" />,
      },
      {
        title: "Simulador",
        to: Routes.simulator.list,
        icon: <LibraryAddOutlinedIcon className="list__button-icons" />,
      },
      {
        title: "Ajuda",
        to: Routes.dashboard.list,
        icon: <HelpOutlineRoundedIcon className="list__button-icons" />,
      }
    ],
    AdminManager: admin,
    MasterAdmin: [
      ...admin,
      {
        title: "Painel Administrativo",
        to: Routes.adminpainel.list,
        icon: <AdminPanelSettingsRoundedIcon className="list__button-icons" />,
      },
    ],
  };

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          paddingTop: '1.5rem',
          height: { xs: 'auto', sm: '100%' },
          width: expanded === 'true' ? 'inherit' : '100%',
          overflowY: 'clip',
          backgroundColor: 'white'
        },
      }}
      variant="permanent"
      anchor="left"
      className={`sidebar sidebar${expanded == 'true' ? '-is-active' : '-is-inactive'}`}
      id="sidebar"
    >
      <div className="sidebar__logo">
        <a
          href="https://riverdata.com.br/"
          target="_blank"
          id="sidebar_link_redirect"
        >
          <img
            src={logo}
            className="image"
            alt="Eucatur Logo"
            id="sidebar_link_image"
          />
        </a>
      </div>

      <ul className="sidebar__menu">
        {menuItems[user?.role ?? UserRole.MASTERADMIN].map((menu, index) => (
          <li key={index} className="list">
            <Button
              id={`sidebar_button_${menu.title}`}
              className={`list__button ${selectedButton === `${index}` ||
                  selectedButton.split('-')[0] === `${index}`
                  ? 'selected'
                  : ''
                }`}
              onClick={() => handleMenuClick(index, !!menu.children, menu.to)}
            >
              {menu.icon}
              <span className="list__button-title">{menu.title}</span>
            </Button>

            {menu.children && openSubMenuIndex === index && (
              <ul className="sidebar__submenu">
                {menu.children.map((child, childIndex) => (
                  <li key={childIndex} className="list list--child">
                    <Button
                      id={`sidebar_button_${child.title}`}
                      className={`list__button ${selectedButtonSubMenu === `${index}-${childIndex}` ? 'selected' : ''
                        }`}
                      onClick={() => handleSubMenuClick(index, childIndex, child.to)}
                    >
                      {child.icon}
                      <span className="list__button-title">{child.title}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        <li className="list">
          <Button
            id="sidebar_button_logout"
            className="list__button"
            onClick={onSubmitLogout()}
          >
            <LogoutIcon className="list__button-icons" />
            <span className="list__button-title">Sair</span>
          </Button>
        </li>
      </ul>
    </Drawer>
  );
}
