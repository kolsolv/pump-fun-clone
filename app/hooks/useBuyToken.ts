import { useState } from 'react';
import { useFactoryContract } from './useFactoryContract';
import { ethers } from 'ethers';

export const useBuyToken = () => {
  const factoryContract = useFactoryContract();
  const [isLoading, setIsLoading] = useState(false);

  const buyToken = async (token: string, amount: string, totalCost: bigint) => {
    if (!factoryContract) return;

    setIsLoading(true);
    try {
      const tx = await factoryContract.buy(
        token,
        ethers.parseUnits(amount, 18),
        { value: totalCost }
      );
      await tx.wait();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };
  return { buyToken, isLoading };
};
