import { TCPData } from "../types/TCPData"
import { TestUpgrade } from "../types/TestUpgrade"

import { expect } from "chai";
import { ethers, upgrades, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("TCPData", function () {
  let tcpdata: TCPData
  let signer: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress

  beforeEach(async () => {
    const TCPData = await ethers.getContractFactory("TCPData");
    tcpdata = await upgrades.deployProxy(TCPData) as TCPData;

    [ signer, addr1, addr2 ] = await ethers.getSigners()

    await tcpdata.deployed();
  })

  it("Should include one content header automatically", async () => {
    expect(await tcpdata.getContentLength()).to.equal(1);
  })

  it("Should be able to store a value", async () => {
    const header_expected = '{ "title": "test" }'

    await expect(await tcpdata.addContent(header_expected)).to.emit(tcpdata, "ContentAdded").withArgs(1)
    
    const [ header_actual, address_actual, idx_actual ] = await tcpdata.getLastContent()

    expect(header_actual).to.equal(header_expected)
    expect(address_actual).to.equal(signer.address)
    expect(idx_actual).to.equal(1)
  })

  it("Should save post timestamps", async () => {
    await tcpdata.addContent("{ffff}");
    const [ , , idx_actual ] = await tcpdata.getLastContent()
    expect(await tcpdata.getContentTimestamp(idx_actual)).to.equal((await addr1.provider!.getBlock("latest"))!.timestamp)
  })

  it("Should emit events when tipping", async () => {
    const [ _, __, idx ] = await tcpdata.getLastContent()
    const tip_amount = ethers.BigNumber.from("1000000000000000000") // 1 ETH

    await expect(await tcpdata.connect(addr2).tipContent(idx, { value: tip_amount }))
    .to.emit(tcpdata, "TipReceived").withArgs(idx, tip_amount);
  })

  it("Should allow to tip people", async () => {
    const tipped = addr2
    const tipper = addr1
    const tip_amount = 0x12345

    // the account that will get the tip should not have any funds
    expect(await tcpdata.getBalance(tipped.address)).to.equal(0)

    // send the tip
    await tcpdata.connect(tipper).tipPerson(addr2.address, { value: tip_amount })

    // the contract balance of the tipped should now increase
    expect(await tcpdata.getBalance(tipped.address)).to.equal(tip_amount)

    // the tipped should be able to withdraw
    expect(await tcpdata.connect(tipped).withdrawBalance()).to.changeEtherBalance(tipped, tip_amount)
  })
  
  it("Should allow content tips and withdrawals", async () => {
    const balance_before = await addr1.getBalance()
    const [ _, __, idx ] = await tcpdata.getLastContent()

    const tip_amount = 0xfff
    

    // check whether the tipper's account balance is decreased
    await expect(await tcpdata.connect(addr1).tipContent(idx, { value: tip_amount }))
      .to.changeEtherBalance(addr1, -tip_amount)

    // check whether the receiver's contract balance is increased
    expect(await tcpdata.getBalance(signer.address)).to.equal(tip_amount)
    expect(await tcpdata.getContentBalance(idx)).to.equal(tip_amount)

    // check whether the receiver can withdraw the contract balance
    await expect(await tcpdata.withdrawBalance())
      .to.changeEtherBalance(signer, tip_amount)

    // check whether the balance was reset after the withdrawal
    expect(await tcpdata.getBalance(signer.address)).to.equal(0)
    // the content balance should stay unchanged
    expect(await tcpdata.getContentBalance(idx)).to.equal(tip_amount)
  })

  it("Should disallow too large uploads", async () => {
    const header = 'ab'.repeat(2000)

    expect(tcpdata.addContent(header)).to.be.revertedWith("Too large.")
  })

  it("Should return all the content upon calling getContent", async () => {
    const header1 = '{title: "test content 1"}'
    const header2 = '{title: "test content 2"}'

    await tcpdata.addContent(header1)
    await tcpdata.addContent(header2)

    const all_content = await tcpdata.getContent()
    const [ last_header, last_author, last_idx ] = await tcpdata.getLastContent()

    expect(last_header).to.equal(all_content[all_content.length-1].header)
    expect(last_author).to.equal(all_content[all_content.length-1].author)
    expect(last_idx).to.equal(all_content.length-1)

    expect(all_content[all_content.length-1].header).to.equal(header2)
    expect(all_content[all_content.length-2].header).to.equal(header1)
  })

  it("Should be able to upgrade", async () => {
    const TestUpgrade = await ethers.getContractFactory("TestUpgrade")

    const address_expected = tcpdata.address
    const [ , author_expected,  ] = await tcpdata.getLastContent()

    const tcpdata_upgraded: TestUpgrade = await upgrades.upgradeProxy(tcpdata.address, TestUpgrade) as TestUpgrade

    expect(tcpdata_upgraded.address).to.equal(address_expected)
    expect(await tcpdata_upgraded.test()).to.equal(123)
    
    const author_actual = await tcpdata_upgraded.getLastContentAuthor()
    expect(author_actual).to.equal(author_expected)
  })

  it("Should allow the author to remove posts", async () => {
    const header_initial = '{ "title": "test" }'

    await tcpdata.addContent(header_initial)

    const [ header_actual_first, , idx_actual ] = await tcpdata.getLastContent()

    expect(header_actual_first).to.equal(header_initial)

    await tcpdata.removeContent(idx_actual)

    const [ header_actual_second, , ] = await tcpdata.getLastContent()

    expect(header_actual_second).to.equal('')
  })

  it("Should allow the owner to remove posts", async () => {
    const header_initial = '{ "title": "test" }'

    await tcpdata.connect(addr1).addContent(header_initial)

    const [ , , idx_actual ] = await tcpdata.getLastContent()

    await tcpdata.connect(signer).removeContent(idx_actual)

    const [ header_actual_second, , idx_actual_second ] = await tcpdata.getLastContent()
    expect(header_actual_second).to.equal('')
    expect(idx_actual).to.equal(idx_actual_second)
  })

  it("Should forbid non-authors to remove a post", async () => {
    const header_initial = '{ "title": "test" }'

    await tcpdata.connect(addr1).addContent(header_initial)

    const [ header_actual_first, , idx_actual ] = await tcpdata.getLastContent()

    expect(header_actual_first).to.equal(header_initial)

    await expect(tcpdata.connect(addr2).removeContent(idx_actual)).to.be.revertedWith("No access")
  })

  it("Should forbid too late removals", async () => { 
    await tcpdata.addContent('{ "title": "test" }')
    const [ , , idx_actual ] = await tcpdata.getLastContent();

    // advance the clock by 3 days (in seconds) and mine a block with the modified timestamp
    await network.provider.send("evm_increaseTime", [60*60*24*3])
    await network.provider.send("evm_mine")

    await expect(tcpdata.removeContent(idx_actual)).to.be.revertedWith("Too late")
  })

  it("Should allow the owner to change", async () => {
    const owner = await tcpdata.owner()
    expect(owner).to.equal(signer.address)

    const newOwnerExpected = addr1.address
    await tcpdata.setOwner(newOwnerExpected)
    const newOwnerActual = await tcpdata.owner()

    expect(newOwnerExpected).to.equal(newOwnerActual)
  })

  it("Should allow to change a null owner", async () => {
    await tcpdata.setOwner(ethers.constants.AddressZero)
    expect(await tcpdata.owner()).to.equal(ethers.constants.AddressZero)

    await tcpdata.connect(addr2).setOwner("0x0000000000000000000000000000000000000123")

    expect(await tcpdata.owner()).to.equal("0x72F070B5bC144386727977e44A6D261aD08e61fd")
  })

  it("Should forbid an unauthorized owner change", async () => {
    await expect(tcpdata.connect(addr2).setOwner(addr1.address)).to.be.revertedWith("No access")
  })

  it("Should return a version", async () => {
    expect(await tcpdata.version()).to.equal(3)
  })
});
