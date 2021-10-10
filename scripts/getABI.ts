import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  const tcpdataArtifact = await hre.artifacts.readArtifact("contracts/TCPData.sol:TCPData")
  const iface = new ethers.utils.Interface(tcpdataArtifact.abi)
  console.log(iface.format(ethers.utils.FormatTypes.full))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
