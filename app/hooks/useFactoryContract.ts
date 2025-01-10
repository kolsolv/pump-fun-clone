import { Contract, ethers } from 'ethers';
import { FactoryAbi } from '../abi/Factory';
import { useMemo } from 'react';
import { useWeb3Context } from '../context/Web3Context';
import { config } from '../config';

export const useFactoryContract = (): ethers.Contract | null => {
  const { state } = useWeb3Context();

  return useMemo(
    () =>
      state.signer && state.currentChain
        ? new Contract(
            config[state.currentChain].factory.address,
            FactoryAbi,
            state.signer
          )
        : null,
    [state.signer, state.currentChain]
  );
};
