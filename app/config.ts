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
  },
  '17000': {
    factory: {
      address: '0xD26A7e3796ec5065fc3732B3C1c87b566b4c386B'
    }
  }
};
