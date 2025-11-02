import { User } from '@utils/entities';
import StorageUser from '@utils/services/storage/user';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContextStateValues = {
  user: User;
};

type UserContextStateDispatchs = {
  setUser: (data: any) => void;
};

type UserContextState = UserContextStateValues & UserContextStateDispatchs;

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext<UserContextState>({} as UserContextState);

function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userAuthenticated = StorageUser.get();

    setUser(userAuthenticated);
  }, []);

  const providerValues = {
    user,
  } as UserContextStateValues;

  const providerDispatchs = {
    setUser,
  } as UserContextStateDispatchs;

  return (
    <UserContext.Provider value={{ ...providerValues, ...providerDispatchs }}>
      {children}
    </UserContext.Provider>
  );
}

function useUserProvider(): UserContextState {
  const context = useContext(UserContext);

  return context;
}

export { UserProvider, useUserProvider };
