# The Content Protocol - Contracts

This is the repo with smart contracts for The Content Protocol. It also contains comprehensive tests and deployments for the contracts.

Basic commands:

```shell
yarn hardhat test
yarn hardhat coverage

```

Additional commands:

```shell
yarn hardhat accounts
yarn hardhat compile
yarn hardhat clean
yarn hardhat node
node scripts/sample-script.js
```

The contract is presently deployed at:

```
Ropsten: 0x0D3E48e537F69d4BDbdc84a1A5BbD70Ad1fD0756
BSCTestnet: 0xa398De2fEF0b37cf50c2F9D88b8953b94b49c78C
```

To get the ABI, first check out the latest version and then run getABI: 

```shell
git checkout $(git rev-list --tags --max-count=1)
yarn hardhat run scripts/getABI.ts
```