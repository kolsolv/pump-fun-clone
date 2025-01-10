import { MetaMaskInpageProvider } from '@metamask/providers';
import { BrowserProvider, ethers, JsonRpcSigner } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export interface IWeb3State {
  address: string | null;
  currentChain: number | null;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  isAuthenticated: boolean;
}

const useWeb3Provider = () => {
  const initialWeb3State = {
    address: null,
    currentChain: null,
    signer: null,
    provider: null,
    isAuthenticated: false
  };
  const [state, setState] = useState<IWeb3State>(initialWeb3State);

  const connectWallet = useCallback(async () => {
    if (state.isAuthenticated) return;

    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Please install MetaMask!');
        return;
      }
      const provider = new ethers.BrowserProvider(ethereum);
      const accounts: string[] = await provider.send('eth_requestAccounts', []);

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const chain = Number((await provider.getNetwork()).chainId);

        setState({
          ...state,
          address: accounts[0],
          signer,
          currentChain: chain,
          provider,
          isAuthenticated: true
        });

        localStorage.setItem('isAuthenticated', 'true');
      }
    } catch {}
  }, [state]);

  const disconnect = () => {
    setState(initialWeb3State);
    localStorage.removeItem('isAuthenticated');
  };

  useEffect(() => {
    if (window && localStorage.hasOwnProperty('isAuthenticated')) {
      connectWallet();
    }
  }, [connectWallet, state.isAuthenticated]);

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    // @ts-expect-error: figure out how to fix this
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      setState({ ...state, address: accounts[0] });
    });

    // @ts-expect-error: figure out how to fix this
    window.ethereum.on('networkChanged', (network: string) => {
      setState({ ...state, currentChain: Number(network) });
    });

    return () => {
      window.ethereum?.removeAllListeners();
    };
  }, [state]);

  return {
    connectWallet,
    disconnect,
    state
  };
};

export default useWeb3Provider;
