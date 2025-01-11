import { useState } from 'react';
import { useFactoryContract } from './useFactoryContract';

const JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3Zjk2ZTgwMi05OTYxLTQ1MDAtOTcwNC1lMTkwNGVlZjZlZWIiLCJlbWFpbCI6ImtvbHNvbHZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ3NzNiMDI2ODUxZjA5YzEzZDU1Iiwic2NvcGVkS2V5U2VjcmV0IjoiZTlmMzMwMzM1Yjc1OWU5ZDk2ZWMzMDk3NTgxNjM5MWVhNGNhYzZjYjljMjAyNDBkN2NhYTkwYjZhNTkwMzI3MSIsImV4cCI6MTc2ODE0MTUyNH0.2v4lAYhx_x9ALcqlVdpeBezJvIduGpCkCu19go-aiWE';

export const useListToken = () => {
  const factoryContract = useFactoryContract();
  const [isLoading, setIsLoading] = useState(false);

  const uploadFileToIpfs = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const metadata = JSON.stringify({
        name: 'File name'
      });
      formData.append('pinataMetadata', metadata);

      const res = await fetch(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${JWT}`
          },
          body: formData
        }
      );
      const resData = await res.json();
      return resData.IpfsHash;
    } catch {
      return '';
    }
  };

  const listToken = async (
    name: string,
    ticker: string,
    tokenImage: File,
    fee: bigint
  ) => {
    if (!factoryContract || !name || !ticker || !tokenImage) return;

    setIsLoading(true);
    const ipfsHash = await uploadFileToIpfs(tokenImage);
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
