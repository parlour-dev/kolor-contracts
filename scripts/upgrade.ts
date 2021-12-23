import hre, { upgrades } from "hardhat";

async function main() {
  await hre.run('compile');

  // ropsten:    
  const KolorDataProxyAddress = "0x80f7a21F59Ad56da7aCf8aC3c437e20347d24c59";
  
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
