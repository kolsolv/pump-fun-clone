import { useCallback, useEffect, useState } from 'react';
import { useFactoryContract } from './useFactoryContract';

export const useFactoryFee = () => {
  const factoryContract = useFactoryContract();
  const [fee, setFee] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(false);

  const getFee = useCallback(async () => {
    if (!factoryContract) return;
    setIsLoading(true);
    try {
      const fee = await factoryContract.fee();
      setFee(fee);
    } catch {
      setFee(0n);
    } finally {
      setIsLoading(false);
    }
  }, [factoryContract]);

  useEffect(() => {
    getFee();
  }, [getFee]);

  return { fee, isLoading };
};
