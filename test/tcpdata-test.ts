import { TCPData } from "../types/TCPData"
import { TestUpgrade } from "../types/TestUpgrade"

import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("TCPData", function () {
  let tcpdata: TCPData
  let signer: SignerWithAddress, addr1: SignerWithAddress

  beforeEach(async () => {
    const TCPData = await ethers.getContractFactory("TCPData");
    tcpdata = await upgrades.deployProxy(TCPData) as TCPData;

    [ signer, addr1 ] = await ethers.getSigners()

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

  it("Should allow tips and withdrawals", async () => {
    const balance_before = await addr1.getBalance()
    const [ _, __, idx ] = await tcpdata.getLastContent()

    const tip_amount = 0xfff
    

    // check whether the tipper's account balance is decreased
    await expect(await tcpdata.connect(addr1).tipAuthor(idx, { value: tip_amount }))
      .to.changeEtherBalance(addr1, -tip_amount)

    // check whether the receiver's contract balance is increased
    expect(await tcpdata.getBalance()).to.equal(tip_amount)

    // check whether the receiver can withdraw the contract balance
    await expect(await tcpdata.withdrawBalance())
      .to.changeEtherBalance(signer, tip_amount)

    // check whether the balance was reset after the withdrawal
    expect(await tcpdata.getBalance()).to.equal(0)
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
    expect(await tcpdata_upgraded.getLastContentAuthor()).to.equal(author_expected)
  })
});
