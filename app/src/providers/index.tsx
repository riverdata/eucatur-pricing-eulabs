import { UserProvider } from "./UserProvider";
import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { StepperProvider } from "./StepperProvider";

type ProvidersProps = {
  children: ReactNode;
};


export default function Providers({ children }: ProvidersProps) {
  return (
    <UserProvider>
      <ThemeProvider>
        <StepperProvider>
          {children}
        </StepperProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
