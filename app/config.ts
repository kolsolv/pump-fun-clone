type Config = {
  [chainId: string]: {
    factory: {
      address: string;
    };
  };
};

export const config: Config = {
  '31337': {
    factory: {
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    }
  }
};
