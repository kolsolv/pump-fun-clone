'use client';
import { ethers } from 'ethers';

import { MetaMaskInpageProvider } from '@metamask/providers';
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export const useProvider = () => {
  const provider = window.ethereum
    ? new ethers.BrowserProvider(window.ethereum)
    : null;
  return { provider };
};
