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

The v7 contract is presently deployed at:

```
Ropsten: 0x0531aFBb877b438D213A39681D97F29Ddf53a51a
```

To get the ABI, first check out the latest version and then run getABI: 

```shell
git checkout $(git rev-list --tags --max-count=1)
yarn hardhat run scripts/getABI.ts
```