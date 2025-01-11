import { useState } from 'react';
import { useFactoryContract } from './useFactoryContract';
import { useUploadToIpfs } from './useUploadToIpfs';
import { useGenerateOneTimeJwt } from './useGenerateOneTimeJwt';
import { useRevokeOneTimeJwt } from './useRevokeOneTimeJwt';

export const useListToken = () => {
  const factoryContract = useFactoryContract();
  const { uploadFileToIpfs } = useUploadToIpfs();
  const [isLoading, setIsLoading] = useState(false);
  const { generateOneTimeJwt } = useGenerateOneTimeJwt();
  const { revokeOneTimeJwt } = useRevokeOneTimeJwt();

  const listToken = async (
    name: string,
    ticker: string,
    tokenImage: File,
    fee: bigint
  ) => {
    if (!factoryContract || !name || !ticker || !tokenImage) return;
    const { jwt, pinataApiKey } = await generateOneTimeJwt();
    if (!jwt || !pinataApiKey) return;

    setIsLoading(true);
    const ipfsHash = await uploadFileToIpfs(tokenImage, jwt);
    const revokeRes = await revokeOneTimeJwt(pinataApiKey);

    if (!revokeRes) {
      console.log('Failed to revoke one-time JWT');
    }

    if (!ipfsHash) return;
    try {
      const tx = await factoryContract.create(name, ticker, ipfsHash, {
        value: fee
      });
      await tx.wait();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };
  return { listToken, isLoading };
};
