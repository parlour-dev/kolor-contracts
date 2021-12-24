import hre, { upgrades } from "hardhat";

async function main() {
  await hre.run('compile');

  // ropsten:    
  const KolorDataProxyAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  
  const KolorData = await hre.ethers.getContractFactory("KolorData");
  const kolordata = await upgrades.upgradeProxy(KolorDataProxyAddress, KolorData);
  await kolordata.deployed();

  console.log("KolorData upgraded at:", kolordata.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
