import StorageTheme from "@utils/services/storage/theme";
import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";


type ContextTypeTheme = {
  expanded: string;
  setExpanded: (flag: string) => void;
};


const ThemeContext = createContext<ContextTypeTheme>({} as ContextTypeTheme);

type ProviderProps = {
  children: ReactNode;
};

function ThemeProvider({ children }: ProviderProps) {

  const saved = StorageTheme.get();
  const [expanded, setExpanded] = useState<string>(saved.sidebar);

  return (
    <ThemeContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useThemeProvider(): ContextTypeTheme {
  const context = useContext(ThemeContext);

  return context;
}

export { ThemeProvider, useThemeProvider };
