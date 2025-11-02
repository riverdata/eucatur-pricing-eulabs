import { StorageService } from "@utils/services/storage";
import { useThemeProvider } from "@providers/ThemeProvider";
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useEffect } from "react";
import { useUserProvider } from "@providers/UserProvider";
import { Stack, Typography, IconButton } from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import './Navbar.scss';
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { expanded, setExpanded } = useThemeProvider();
  const { user } = useUserProvider();
  const fullName = !user ? "" : `${user?.name} ${user?.surname}`
  const saved = StorageService.Theme.get();
  const viewportWidth = window.innerWidth;
  const navigate = useNavigate();

  useEffect(() => {

    if (viewportWidth <= 640) {
      StorageService.Theme.set({ sidebar: 'false' });
      setExpanded('false')
    } else {
      StorageService.Theme.set({ sidebar: 'true' });
      setExpanded('true')
    }

  }, []);

  const bottomExpanded = () => {
    if (saved.sidebar === 'true') {
      StorageService.Theme.set({ sidebar: 'false' });
      setExpanded('false')
    } else {
      StorageService.Theme.set({ sidebar: 'true' });
      setExpanded('true')
    }

  }

  return (

    <nav className={`navbar navbar${expanded == 'true' ? '-is-active' : '-is-inactive'}`} id="navbar">
      <div className="navbar__container">

        <div className="navbar__container__button">
          <button
            type="button"
            onClick={() => bottomExpanded()}
            className="button"
            id="navbar_button_openmenu"
          >
            {expanded == 'true' ?
              <MenuOpenIcon className="button__icons" /> :
              <MenuIcon className="button__icons" />}

          </button>
        </div>
        <Stack direction="row" spacing={2}>
          <Typography className="text-white sm:!text-[#404040] !font-bold !text-sm 2xl:!text-xl" id="navbar_user">
            {`${fullName}`}
          </Typography>
          <IconButton
            id={`UserList_button_edit`}
            onClick={() => navigate(`/user/${user?.id}/edit`, { replace: true })}
            sx={{
              padding: 0,
              color: '#718096',
            }}
          >
            <ManageAccountsIcon />
          </IconButton>
        </Stack>
      </div>
    </nav>
  );
}
