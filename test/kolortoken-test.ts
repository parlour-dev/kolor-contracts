import { KolorToken } from "../types";

import { expect } from "chai";
import { ethers, upgrades, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("KolorToken", function () {
  let kolor: KolorToken
  let signer: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress

  beforeEach(async () => {
    [ signer, addr1, addr2 ] = await ethers.getSigners()

    const KolorTokenFactory = await ethers.getContractFactory("KolorToken");
    kolor = await upgrades.deployProxy(KolorTokenFactory) as KolorToken;

    await kolor.deployed();
  })

  it("Has the correct owner", async () => {
    expect(await kolor.owner()).to.equal(signer.address)
  })

  it("Mints correctly", async () => {
    await kolor.mint(1000)

    expect(await kolor.balanceOf(signer.address)).to.equal(1000)

    await expect(kolor.connect(addr1).mint(1000)).to.be.revertedWith("Ownable: caller is not the owner")
  })
});
