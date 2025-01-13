import { useCallback, useEffect, useState } from 'react';
import { useFactoryContract } from './useFactoryContract';
import { Token } from '../model/token';

const IPFS_URL = 'https://gateway.pinata.cloud/ipfs/';

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
      const tokenSales = (
        (await Promise.all(
          Array.from({ length: totalTokens }).map((_, index) =>
            factoryContract.getTokenSale(index)
          )
        )) || []
      ).map((tokenSale) => ({
        token: tokenSale.token,
        name: tokenSale.name,
        creator: tokenSale.creator,
        sold: tokenSale.sold,
        raised: tokenSale.raised,
        isOpen: tokenSale.isOpen
      })) as Token[];

      const tokenImages = await Promise.all(
        tokenSales.map((_, index) => factoryContract.getTokenImageUri(index))
      );
      const tokenSalesWithImages = tokenSales.map((tokenSale, index) => ({
        ...tokenSale,
        image: IPFS_URL + tokenImages[index]
      }));

      setListedTokens(tokenSalesWithImages.reverse());
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

  const refetch = useCallback(() => setShouldRefetch(true), []);

  return { listedTokens, isLoading, refetch };
};
