export const useUploadToIpfs = () => {
  const uploadFileToIpfs = async (file: File, jwt: string): Promise<string> => {
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
            Authorization: `Bearer ${jwt}`
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

  return { uploadFileToIpfs };
};
