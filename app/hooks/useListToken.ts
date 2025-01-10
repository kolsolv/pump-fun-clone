import { useState } from 'react';
import { useFactoryContract } from './useFactoryContract';

export const useListToken = () => {
  const factoryContract = useFactoryContract();
  const [isLoading, setIsLoading] = useState(false);

  const listToken = async (name: string, ticker: string, fee: bigint) => {
    if (!factoryContract) return;

    setIsLoading(true);
    try {
      const tx = await factoryContract.create(name, ticker, { value: fee });
      await tx.wait();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };
  return { listToken, isLoading };
};
