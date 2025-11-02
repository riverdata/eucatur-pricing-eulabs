import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import Router from "./routes";
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme } from '@theme';
import { StepperProvider } from '@providers/StepperProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <StepperProvider>
      <RouterProvider router={Router} />
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </StepperProvider>
  </ThemeProvider>
)
