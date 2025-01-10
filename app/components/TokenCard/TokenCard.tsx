import { Token } from '@/app/model/token';
import { ethers } from 'ethers';
import { FC } from 'react';
import styles from './token-card.module.css';
import classNames from 'classnames';

interface TokenCardProps {
  token: Token;
  onClick?: React.MouseEventHandler;
}

export const TokenCard: FC<TokenCardProps> = ({ onClick, token }) => {
  return (
    <div className={styles.token} onClick={onClick}>
      <div className={styles.token__details}>
        <img
          className={styles.token__image}
          src={token.image}
          alt={token.name}
          width={256}
          height={256}
        />
        <p className={styles.token__detailsRow}>
          created by:{' '}
          {token.creator.slice(0, 6) + '...' + token.creator.slice(-4)}
        </p>
        <p className={classNames(styles.token__detailsRow, styles.token__mcap)}>
          market cap: {ethers.formatUnits(token.raised, 18)} ETH
        </p>
        <p className={styles.token__name}>{token.name}</p>
      </div>
    </div>
  );
};
