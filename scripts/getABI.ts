import hre from "hardhat";

async function main() {
  const tcpdataArtifact = await hre.artifacts.readArtifact("contracts/TCPData.sol:TCPData")
  console.log(tcpdataArtifact.abi)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
