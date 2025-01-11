'use client';
import { FC } from 'react';
import { Button } from '../Button/Button';
import styles from './list.module.css';
import { ethers } from 'ethers';
import { useFactoryFee } from '@/app/hooks/useFactoryFee';
import { useListToken } from '@/app/hooks/useListToken';
import Spinner from '../Spinner/Spinner';

interface ListTokenModalProps {
  onList: () => void;
  onClose: () => void;
}

export const ListTokenModal: FC<ListTokenModalProps> = ({
  onList,
  onClose
}) => {
  const { fee, isLoading: isFeeLoading } = useFactoryFee();
  const { listToken, isLoading: isListingToken } = useListToken();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fee) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const ticker = formData.get('ticker') as string;
    const file = formData.get('token-image') as File;

    await listToken(name, ticker, file, fee);
    onList();
    onClose();
  };

  return (
    <div className={styles.list}>
      <h2>List new token</h2>
      <div className={styles.list__description}>
        {isFeeLoading ? (
          <Spinner />
        ) : (
          <p>fee: {ethers.formatUnits(fee, 18)} ETH</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="name" />
        <input type="text" name="ticker" placeholder="ticker" />
        <label className="form-label"> Choose File</label>
        <input type="file" name="token-image" />

        {isListingToken ? <Spinner /> : <Button type="submit">[ list ]</Button>}
      </form>

      <Button onClick={onClose}>[ cancel ]</Button>
    </div>
  );
};
