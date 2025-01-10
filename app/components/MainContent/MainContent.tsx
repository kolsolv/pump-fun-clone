'use client';
import { useState } from 'react';
import { Button } from '../Button/Button';
import styles from './main.module.css';
import { ListTokenModal } from '../ListTokenModal/ListTokenModal';
import { useFactoryContract } from '@/app/hooks/useFactoryContract';
import { useWeb3Context } from '@/app/context/Web3Context';
import { useListedTokens } from '@/app/hooks/useListedTokens';
import { TokenCard } from '../TokenCard/TokenCard';

export const MainContent = () => {
  const factory = useFactoryContract();
  const { state } = useWeb3Context();
  const { listedTokens } = useListedTokens();
  const [showCreateToken, setShowCreateToken] = useState(false);

  const getCreateButtonText = () => {
    if (!factory) {
      return 'Conract not deployed';
    }
    if (!state.address) {
      return 'Please connect your wallet';
    }
    return '[ create token ]';
  };

  return (
    <main className={styles.main}>
      <Button
        onClick={() => factory && state.address && setShowCreateToken(true)}
      >
        {getCreateButtonText()}
      </Button>
      {showCreateToken && (
        <ListTokenModal onClose={() => setShowCreateToken(false)} />
      )}

      <div className={styles.listings}>
        <h1 className={styles.listings__title}>new listings</h1>

        <div className={styles.tokens}>
          {listedTokens.map((token) => (
            <TokenCard token={token} key={token.token} />
          ))}
        </div>
      </div>
    </main>
  );
};
