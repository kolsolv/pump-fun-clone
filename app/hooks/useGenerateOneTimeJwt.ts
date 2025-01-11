export const useGenerateOneTimeJwt = () => {
  const generateOneTimeJwt = async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/key'
    );
    const { pinata_api_key, JWT } = await response.json();
    return { jwt: JWT, pinataApiKey: pinata_api_key };
  };

  return { generateOneTimeJwt };
};
