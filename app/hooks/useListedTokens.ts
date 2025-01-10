import { useCallback, useEffect, useState } from 'react';
import { useFactoryContract } from './useFactoryContract';
import { Token } from '../model/token';

export const useListedTokens = () => {
  const factoryContract = useFactoryContract();
  const [listedTokens, setListedTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const getListedTokens = useCallback(async () => {
    if (!factoryContract) return [];

    setIsLoading(true);
    try {
      const totalTokens = Number(await factoryContract.totalTokens());
      const tokens = (await Promise.all(
        Array.from({ length: totalTokens }).map((_, index) =>
          factoryContract.getTokenSale(index)
        )
      )) as Token[];

      setListedTokens(
        tokens
          .map((tokenSale) => ({
            token: tokenSale.token,
            name: tokenSale.name,
            creator: tokenSale.creator,
            sold: tokenSale.sold,
            raised: tokenSale.raised,
            isOpen: tokenSale.isOpen,
            image:
              'https://pump.mypinata.cloud/ipfs/Qmbtwhgc1WndvcRJ2Dps7nKVfLgLbfuiwf56Ac8n2X5k3U?img-width=128&img-dpr=2&img-onerror=redirect'
          }))
          .reverse()
      );
    } catch {
    } finally {
      setIsLoading(false);
      setFirstTime(false);
      setShouldRefetch(false);
    }
  }, [factoryContract]);

  useEffect(() => {
    if (shouldRefetch || firstTime) {
      getListedTokens();
    }
  }, [getListedTokens, shouldRefetch, firstTime]);

  const refetch = () => setShouldRefetch(true);

  return { listedTokens, isLoading, refetch };
};
