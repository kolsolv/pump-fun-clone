'use client';
import { FC, useState } from 'react';
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
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const ticker = formData.get('ticker') as string;
    const file = formData.get('token-image') as File;
    if (!fee || !name || !ticker || !file) return;

    await listToken(name, ticker, file, fee);
    onList();
    onClose();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCurrentFileName(null);
      return;
    }
    setCurrentFileName(file.name);
  };

  const truncateFileName = (fileName: string) => {
    return fileName.length > 15
      ? fileName.slice(0, 10) + '...' + fileName.slice(-4)
      : fileName;
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

        <label htmlFor="image-upload" className={styles.upload__label}>
          {!currentFileName ? 'Choose File' : truncateFileName(currentFileName)}
        </label>
        <input
          id="image-upload"
          className={styles.input__upload}
          type="file"
          name="token-image"
          onChange={onFileChange}
        />

        {isListingToken ? <Spinner /> : <Button type="submit">[ list ]</Button>}
      </form>

      <Button onClick={onClose}>[ cancel ]</Button>
    </div>
  );
};
