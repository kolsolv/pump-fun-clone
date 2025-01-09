import { Header } from './components/Header/Header';
import { AccountContextProvider } from './context/AccountContext';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <AccountContextProvider>
        <Header />
      </AccountContextProvider>
    </div>
  );
}
