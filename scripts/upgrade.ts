import hre, { ethers, upgrades } from "hardhat";

async function main() {
  await hre.run('compile');

  // ropsten:    0x0D3E48e537F69d4BDbdc84a1A5BbD70Ad1fD0756
  // bsctestnet: 0xa398De2fEF0b37cf50c2F9D88b8953b94b49c78C
  const TCPDataProxyAddress = "0xa398De2fEF0b37cf50c2F9D88b8953b94b49c78C";
  
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
