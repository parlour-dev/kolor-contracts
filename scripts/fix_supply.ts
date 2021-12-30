// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre, { upgrades, ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');

  const kolor = await ethers.getContractAt("KolorToken", "0x7b530Cfb1CB99D2fBf5047254CcF62699C3Cd5e8")

  const fifteen_mil = ethers.BigNumber.from("15000000")
  const wei_multiplier = ethers.BigNumber.from("10").pow("18")
  const supply = fifteen_mil.mul(wei_multiplier)
  const to_mint = supply.sub(fifteen_mil)

  const tx = await kolor.mint(to_mint)

  console.log("Fixed at: ", tx.hash)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
