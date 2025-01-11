import { FC, useState } from 'react';
import styles from './trade-modal.module.css';
import { Token } from '@/app/model/token';
import { Button } from '../Button/Button';
import { ethers } from 'ethers';
import { useTokenFinInfo } from '@/app/hooks/useTokenFinInfo';
import Spinner from '../Spinner/Spinner';
import { useBuyToken } from '@/app/hooks/useBuyToken';

interface TradeModalProps {
  token: Token;
  onClose: () => void;
  onBuy: () => void;
}

export const TradeModal: FC<TradeModalProps> = ({ token, onBuy, onClose }) => {
  const [amount, setAmount] = useState(0);
  const { tokenFinInfo, isLoading } = useTokenFinInfo(token);
  const { buyToken, isLoading: isBuying } = useBuyToken();

  const handleBuy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = formData.get('amount') as string;
    const totalCost = BigInt(amount) * (tokenFinInfo?.price || 0n);
    await buyToken(token.token, amount, totalCost);
    onBuy();
    onClose();
  };

  const handleAmountChange = (amount: string) => {
    setAmount(Number(amount));
  };

  return (
    <div className={styles.trade}>
      <h2>Trade</h2>

      <div className={styles.token__details}>
        <p className={styles.token__name}>{token.name}</p>
        <p>
          creator: {token.creator.slice(0, 6) + '...' + token.creator.slice(-4)}
        </p>
        <img
          src={token.image}
          alt={token.name}
          width={256}
          height={256}
          className={styles.token__image}
        />
        <p>market cap: {ethers.formatUnits(token.raised, 18)} ETH</p>
        {isLoading ? (
          <Spinner />
        ) : (
          <p>
            base cost: {ethers.formatUnits(tokenFinInfo?.price || 0, 18)} ETH
          </p>
        )}

        {tokenFinInfo &&
        (token.sold >= tokenFinInfo.limit ||
          token.raised >= tokenFinInfo.target) ? (
          <p className={styles.disclaimer}>target reached!</p>
        ) : (
          <form onSubmit={handleBuy}>
            <input
              type="number"
              name="amount"
              min={1}
              max={10000}
              placeholder="1"
              onChange={(e) => handleAmountChange(e.target.value)}
            />

            {!!amount && (
              <p>
                total cost:{' '}
                {ethers.formatUnits(
                  BigInt(amount) * (tokenFinInfo?.price || 0n),
                  18
                )}{' '}
                ETH
              </p>
            )}

            <Button type="submit" disabled={isBuying}>
              [ buy ]
            </Button>
            {isBuying && <Spinner />}
          </form>
        )}
      </div>

      <Button onClick={onClose}>[ cancel ]</Button>
    </div>
  );
};
