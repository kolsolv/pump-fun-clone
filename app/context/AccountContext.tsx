'use client';
import { createContext, FC } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface AccountContextProps {
  account: string;
  setAccount: (account: string) => void;
}

export const AccountContext = createContext<AccountContextProps>({
  account: '',
  setAccount: () => {}
});

export const AccountContextProvider: FC<React.PropsWithChildren> = ({
  children
}) => {
  const [account, setAccount] = useLocalStorage('account', '');

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
