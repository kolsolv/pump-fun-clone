import { FC } from 'react';
import { Icon24 } from '../Icon';
import styles from './spinner.module.css';

const Spinner: FC = () => {
  return (
    <div className={styles.spinner}>
      <Icon24.Spinner />
    </div>
  );
};

export default Spinner;
