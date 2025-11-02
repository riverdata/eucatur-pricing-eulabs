import { createContext, useContext, useState } from 'react';

export const StepperContext = createContext(null);

export const StepperProvider = ({ children }) => {
  const [seatsFetched, setSeatsFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <StepperContext.Provider value={{ seatsFetched, setSeatsFetched, loading, setLoading }}>
      {children}
    </StepperContext.Provider>
  );
};

export const useStepper = () => useContext(StepperContext);
