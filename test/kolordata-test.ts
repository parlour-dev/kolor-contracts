import { KolorData } from "../types";

import { expect } from "chai";
import { ethers, upgrades, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("KolorData", function () {
  let kolordata: KolorData
  let signer: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress

  beforeEach(async () => {
    const KolorData = await ethers.getContractFactory("KolorData");
    kolordata = await upgrades.deployProxy(KolorData) as KolorData;

    [ signer, addr1, addr2 ] = await ethers.getSigners()

    await kolordata.deployed();
  })

  it("Should be able to store a value", async () => {
    await expect(kolordata.createPost("testURI")).to.emit(kolordata, "ContentAdded").withArgs(1, signer.address)
    expect(await kolordata.tokenURI(1)).to.equal("testURI")
  })

  it("Should allow to store a value as another user", async () => {
    const author_expected = addr2.address;
    await expect(kolordata.createPostAs(author_expected, "testURI")).to.emit(kolordata, "ContentAdded").withArgs(1, addr2.address)
    expect(await kolordata.tokenURI(1)).to.equal("testURI")
  })

  it("Should disallow storing a value as another user when not the owner", async () => {
    const author_expected = addr2.address;
    await expect(kolordata.connect(addr2).createPostAs(author_expected, "testURI")).to.be.revertedWith("Ownable: caller is not the owner")
  })

  it("Should save post timestamps", async () => {
    await kolordata.createPost("testURI")
    const id = await kolordata.getLastPostId();
    expect(await kolordata.getPostTimestamp(id)).to.equal((await addr1.provider!.getBlock("latest"))!.timestamp)
  })

  it("Should be able to upgrade", async () => {
    await kolordata.createPost("testURI")
    const id = await kolordata.getLastPostId()

    const TestUpgrade = await ethers.getContractFactory("KolorData")

    const address_expected = kolordata.address

    const kolordata_upgraded: KolorData = await upgrades.upgradeProxy(kolordata.address, TestUpgrade) as KolorData

    expect(kolordata_upgraded.address).to.equal(address_expected)
    
    expect(await kolordata.ownerOf(id)).to.equal(signer.address)
    expect(await kolordata.tokenURI(id)).to.equal("testURI")
  })

  it("Should allow the author to burn posts", async () => {
    await kolordata.createPost("testURI")
    const id = await kolordata.getLastPostId()
    
    // (from, to, tokenId)
    await expect(kolordata.burnPost(id)).to.emit(kolordata, "Transfer").withArgs(signer.address, ethers.constants.AddressZero, id)
  })

  it("Should allow the owner to burn posts", async () => {
    await kolordata.connect(addr1).createPost("testURI")
    const id = await kolordata.getLastPostId()

    await expect(kolordata.connect(signer).burnPost(id)).to.emit(kolordata, "Transfer").withArgs(addr1.address, ethers.constants.AddressZero, id)
  })

  it("Should forbid non-authors to burn a post", async () => {
    await kolordata.connect(addr1).createPost("testURI")
    const id = await kolordata.getLastPostId()
    await expect(kolordata.connect(addr2).burnPost(id)).to.be.revertedWith("Not allowed")
  })

  it("Should forbid too late removals", async () => { 
    await kolordata.createPost("testURI");
    const id = await kolordata.getLastPostId()

    // advance the clock by 3 days (in seconds) and mine a block with the modified timestamp
    await network.provider.send("evm_increaseTime", [60*60*24*3])
    await network.provider.send("evm_mine")

    await expect(kolordata.burnPost(id)).to.be.revertedWith("Too late")
  })

  it("Should allow the owner to change", async () => {
    const actual_owner = await kolordata.owner()
    await expect(kolordata.transferOwnership(addr1.address)).to.emit(kolordata, "OwnershipTransferred").withArgs(signer.address, addr1.address)
    expect(await kolordata.owner()).to.equal(addr1.address)
  })

  it("Should forbid an unauthorized owner change", async () => {
    await expect(kolordata.connect(addr1).transferOwnership(addr2.address)).to.be.revertedWith("Ownable: caller is not the owner")
  })

  it("Should return a version", async () => {
    expect(await kolordata.version()).to.equal(7)
  })
});
