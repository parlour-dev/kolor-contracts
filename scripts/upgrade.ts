import hre, { ethers, upgrades } from "hardhat";

async function main() {
  await hre.run('compile');

  const TCPDataProxyAddress = "0xa398De2fEF0b37cf50c2F9D88b8953b94b49c78C";//"0xa398De2fEF0b37cf50c2F9D88b8953b94b49c78C";

  const TCPData = await hre.ethers.getContractFactory("TCPData");
  const tcpdata = await upgrades.upgradeProxy(TCPDataProxyAddress, TCPData);
  await tcpdata.deployed();

  console.log("TCPData upgraded at:", tcpdata.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
