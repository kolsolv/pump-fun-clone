'use client';
import { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import styles from './main.module.css';
import { ListTokenModal } from '../ListTokenModal/ListTokenModal';
import { useFactoryContract } from '@/app/hooks/useFactoryContract';
import { useWeb3Context } from '@/app/context/Web3Context';
import { useListedTokens } from '@/app/hooks/useListedTokens';
import { TokenCard } from '../TokenCard/TokenCard';
import { TradeModal } from '../TradeModal/TradeModal';
import { Token } from '@/app/model/token';
import Spinner from '../Spinner/Spinner';

export const MainContent = () => {
  const factoryContract = useFactoryContract();
  const { state } = useWeb3Context();
  const { listedTokens, refetch, isLoading: tokensLoading } = useListedTokens();
  const [showCreateToken, setShowCreateToken] = useState(false);
  const [currentToken, setCurrentToken] = useState<Token | null>(null);

  const getCreateButtonText = () => {
    if (state.currentChain !== 17000) {
      return 'Please switch to Holesky Testnet';
    }
    if (!state.address) {
      return 'Please connect your wallet';
    }
    if (!factoryContract) {
      return 'Contract not deployed';
    }
    return '[ create token ]';
  };

  useEffect(() => {
    if (state.currentChain) {
      refetch();
    }
  }, [state.currentChain, factoryContract, refetch]);

  return (
    <main className={styles.main}>
      <Button
        onClick={() =>
          factoryContract &&
          state.currentChain === 17000 &&
          state.address &&
          setShowCreateToken(true)
        }
      >
        {getCreateButtonText()}
      </Button>

      <div className={styles.listings}>
        {!!listedTokens.length && (
          <h1 className={styles.listings__title}>new listings</h1>
        )}

        <div className={styles.tokens}>
          {listedTokens.map((token) => (
            <TokenCard
              onClick={() => setCurrentToken(token)}
              token={token}
              key={token.token}
            />
          ))}

          {tokensLoading && <Spinner />}
        </div>
      </div>

      {showCreateToken && (
        <ListTokenModal
          onClose={() => setShowCreateToken(false)}
          onList={() => refetch()}
        />
      )}

      {currentToken && (
        <TradeModal
          token={currentToken}
          onClose={() => setCurrentToken(null)}
          onBuy={() => refetch()}
        />
      )}
    </main>
  );
};
