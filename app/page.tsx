import { Header } from './components/Header/Header';
import { MainContent } from './components/MainContent/MainContent';
import Web3ContextProvider from './context/Web3Context';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <Web3ContextProvider>
        <Header />
        <MainContent />
      </Web3ContextProvider>
    </div>
  );
}
