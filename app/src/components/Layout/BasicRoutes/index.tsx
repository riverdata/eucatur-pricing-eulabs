import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export default function BasicRoutes() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean); // remove elementos vazios

  const labelMap = {
    edit: 'Editar',
    duplicate: 'Duplicar',
    list: 'Listar',
    create: 'Criar',
    view: 'Detalhes',
    adminpainel: 'Painel Administrativo',
    user: 'Usuários',
    precificacao: 'Precificação',
    simulator: 'Simulador',
    department: 'Departamentos',
  };

  let accumulatedPath = '';

  const breadcrumbs = pathSegments.map((segment, index) => {
    const isLast = index === pathSegments.length - 1;

    let label = labelMap[segment] || decodeURIComponent(segment);
    accumulatedPath += `/${segment}`;

    const listRedirectRoutes = ['user', 'precificacao', 'department'];

    const linkTo = listRedirectRoutes.includes(segment)
      ? `/${segment}/list`
      : accumulatedPath;

    if (isLast || pathSegments.includes('list')) {
      return (
        <Typography key={index} color="text.primary" id={`basicroutes_${label}`}>
          {label}
        </Typography>
      );
    }

    return (
      <MuiLink
        key={index}
        component={Link}
        to={linkTo}
        color="inherit"
        underline="hover"
        id={`basicroutes_${label}`}
        className='!text-[#5F6368]'
      >
        {label}
      </MuiLink>
    );
  });

  return (
    <div role="presentation" className='mb-2'>
      <Breadcrumbs aria-label="breadcrumb" id="basicroutes">
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          color="inherit"
          id="basicroutes_eucatur"
        >
          <HomeRoundedIcon />
        </MuiLink>
        {breadcrumbs}
      </Breadcrumbs>
    </div>
  );
}
