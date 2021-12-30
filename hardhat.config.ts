import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/config";

import '@typechain/hardhat'
import '@typechain/ethers-v5'

import "@nomiclabs/hardhat-waffle";
import '@nomiclabs/hardhat-ethers'

import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';

import 'hardhat-erc1820';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
  },
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.ROPSTEN_PRIVATE_KEY}`]
    },
    bsctest: {
      chainId: 97,
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [`0x${process.env.ROPSTEN_PRIVATE_KEY}`]
    },
    bsc: {
      chainId: 56,
      url: "https://bsc-dataseed.binance.org/",
      accounts: [`0x${process.env.BSC_PRIVATE_KEY}`]
    },
    hardhat: {
      chainId: 1337
    }
  }
};

export default config;
