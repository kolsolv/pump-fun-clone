# pump-fun-clone

## Technology Stack & Tools

- Solidity
- TS (Next.js & Testing)
- [Hardhat](https://hardhat.org/)
- [Ethers.js](https://docs.ethers.io/v5/)
- [Next.js](https://nextjs.org/)

## Setting Up

### 1. Install Dependencies:

`$ npm install`

### 2. Run tests

`$ npx hardhat test`

### 3. Start Hardhat node

`$ npx hardhat node`

### 4. Run deployment script

In a separate terminal execute:

`$ npx hardhat ignition deploy ignition/modules/Factory.js --network localhost`

If you have previously deployed you may want to append `--reset` at the end:

`$ npx hardhat ignition deploy ignition/modules/Factory.js --network localhost --reset`

### 5. Start frontend

`$ npm run dev`
