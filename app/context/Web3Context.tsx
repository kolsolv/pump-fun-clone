'use client';
import { createContext, FC, ReactNode, useContext } from 'react';
import useWeb3Provider, { IWeb3State } from '../hooks/useWeb3Provider';

export interface IWeb3Context {
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  state: IWeb3State;
}

const Web3Context = createContext<IWeb3Context>({
  connectWallet: async () => {},
  disconnect: () => {},
  state: {
    address: null,
    currentChain: null,
    isAuthenticated: false,
    provider: null,
    signer: null
  }
});

type Props = {
  children: ReactNode;
};

const Web3ContextProvider: FC<Props> = ({ children }) => {
  const { connectWallet, disconnect, state } = useWeb3Provider();

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        disconnect,
        state
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;
export const useWeb3Context = () => useContext(Web3Context);
