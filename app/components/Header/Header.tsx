'use client';
import { useContext } from 'react';
import styles from './header.module.css';
import { useProvider } from '@/app/hooks/useProvider';
import { AccountContext } from '@/app/context/AccountContext';

export const Header = () => {
  const { account, setAccount } = useContext(AccountContext);
  const { provider } = useProvider();

  const handleConnect = async () => {
    if (!provider) {
      alert('Please install MetaMask!');
      return;
    }

    provider.send('eth_requestAccounts', []).then(async (accounts) => {
      setAccount(accounts[0] || '');
    });
  };

  const getButtoonText = () => {
    if (!account) {
      return 'Connect Wallet';
    }

    return '[' + account.slice(0, 6) + '...' + account.slice(-4) + ']';
  };

  return (
    <header className={styles.header}>
      <h1>pump.fun clone</h1>
      <button onClick={handleConnect} className={styles.account}>
        {getButtoonText()}
      </button>
    </header>
  );
};
