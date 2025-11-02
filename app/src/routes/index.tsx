
import SignInScreen from '@pages/SignIn';
import { ReactNode } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Routes from './paths';
import Providers from '@providers/index.tsx';
import StorageUser from '@utils/services/storage/user';
import DashboardListScreen from '@pages/DashboardList';
import AdminPanelScreen from '@pages/AdminPanel';
import PricingSimulatorScreen from '@pages/PricingSimulator';
import PricingListScreen from '@pages/PricingList';
import PricingIAScreen from '@pages/PricingIA';
import UserListScreen from '@pages/User/list';
import UserCreateScreen from '@pages/User/create';
import UserEditScreen from '@pages/User/edit';
import UserActiveAccountScreen from '@pages/User/active-account';
import ForgotPassword from '@pages/ForgotPassword';
import DepartmentListScreen from '@pages/Department/list';
import DepartmentCreateScreen from '@pages/Department/create';
import DepartmentEditScreen from '@pages/Department/edit';

type RouteProps = {
  component: ReactNode;
};

function Route({ component }: RouteProps) {
  return <Providers>{component}</Providers>;
}

function PublicRoute({ component }: RouteProps) {
  const isUserAuthenticated = !!StorageUser.get();

  if (isUserAuthenticated) {
    return <Navigate to={Routes.precificacao.list} replace />;
  }

  return <Providers>{component}</Providers>;
}

function PrivateRoute({ component }: RouteProps) {
  const user = StorageUser.get();

  if (!user) {
    return <Navigate to={Routes.base} replace />;
  }

  return <Providers>{component}</Providers>;
}

export const Router = createBrowserRouter([
  {
    path: Routes.base,
    element: <PublicRoute component={<SignInScreen />} />,
  },
  {
    path: Routes.signIn,
    element: <PublicRoute component={<SignInScreen />} />,
  },
  {
    path: Routes.dashboard.list,
    element: <PrivateRoute component={<DashboardListScreen />} />,
  },
  {
    path: Routes.precificacao.list,
    element: <PrivateRoute component={<PricingListScreen />} />,
  },
  {
    path: Routes.precificacao.create,
    element: <PrivateRoute component={<PricingIAScreen />} />,
  },
  {
    path: Routes.precificacao.edit,
    element: <PrivateRoute component={<PricingIAScreen />} />,
  },
  {
    path: Routes.precificacao.duplicate,
    element: <PrivateRoute component={<PricingIAScreen />} />,
  },
  {
    path: Routes.simulator.list,
    element: <PrivateRoute component={<PricingSimulatorScreen />} />,
  },
  {
    path: Routes.adminpainel.list,
    element: <PrivateRoute component={<AdminPanelScreen />} />,
  },
  {
    path: Routes.user.list,
    element: <PrivateRoute component={<UserListScreen />} />,
  },
  {
    path: Routes.user.create,
    element: <PrivateRoute component={<UserCreateScreen />} />,
  },
  {
    path: Routes.user.edit,
    element: <PrivateRoute component={<UserEditScreen />} />,
  },
  {
    path: Routes.user.active,
    element: <PublicRoute component={<UserActiveAccountScreen />} />,
  },
  {
    path: Routes.user.forgotPassword,
    element: <Route component={<ForgotPassword />} />,
  },
  {
    path: Routes.department.list,
    element: <PrivateRoute component={<DepartmentListScreen />} />,
  },
  {
    path: Routes.department.create,
    element: <PrivateRoute component={<DepartmentCreateScreen />} />,
  },
  {
    path: Routes.department.edit,
    element: <PrivateRoute component={<DepartmentEditScreen />} />,
  },
]);

export default Router;
