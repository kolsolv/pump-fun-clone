import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.27',
  networks: {
    holesky: {
      url: process.env.ALCHEMY_HOLESKY_URL,
      accounts: { mnemonic: process.env.MNEMONIC }
    }
  }
};

export default config;
