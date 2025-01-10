import { useCallback, useEffect, useState } from 'react';
import { useFactoryContract } from './useFactoryContract';
import { Token } from '../model/token';

export type TokenFinInfo = {
  price: bigint;
  limit: bigint;
  target: bigint;
};

export const useTokenFinInfo = (token: Token) => {
  const factoryContract = useFactoryContract();
  const [tokenFinInfo, setTokenFinInfo] = useState<TokenFinInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPrice = useCallback(async () => {
    if (!factoryContract) return;
    setIsLoading(true);
    try {
      const price = await factoryContract.getCost(token.sold);
      const limit = await factoryContract.TOKEN_LIMIT();
      const target = await factoryContract.TARGET();

      setTokenFinInfo({ price, limit, target });
    } catch {
      setTokenFinInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [factoryContract, token]);

  useEffect(() => {
    getPrice();
  }, [getPrice]);

  return { tokenFinInfo, isLoading };
};
