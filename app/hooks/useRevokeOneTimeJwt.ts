export const useRevokeOneTimeJwt = () => {
  const revokeOneTimeJwt = async (keyId: string) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + `/api/auth/key/${keyId}`,
      {
        method: 'PUT'
      }
    );
    const { success } = await response.json();
    return success;
  };

  return { revokeOneTimeJwt };
};
