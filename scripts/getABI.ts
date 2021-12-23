import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  const kolordataArtifact = await hre.artifacts.readArtifact("contracts/KolorData.sol:KolorData")
  const iface = new ethers.utils.Interface(kolordataArtifact.abi)
  console.log(iface.format(ethers.utils.FormatTypes.full))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
