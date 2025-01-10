'use client';
import styles from './header.module.css';
import { Button } from '../Button/Button';
import { useWeb3Context } from '@/app/context/Web3Context';

export const Header = () => {
  const {
    connectWallet,
    disconnect,
    state: { isAuthenticated, address }
  } = useWeb3Context();

  const toggleConnect = async () => {
    if (isAuthenticated) {
      disconnect();
      return;
    }
    connectWallet();
  };

  const getButtoonText = () => {
    if (!address) {
      return 'Connect Wallet';
    }

    return '[' + address.slice(0, 6) + '...' + address.slice(-4) + ']';
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>pump.fun clone</h1>
      <Button onClick={toggleConnect} className={styles.accountButton}>
        {getButtoonText()}
      </Button>
    </header>
  );
};
