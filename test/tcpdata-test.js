const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TCPData", function () {
  let tcpdata
  let signer, addr1

  beforeEach(async () => {
    const TCPData = await ethers.getContractFactory("TCPData");
    tcpdata = await TCPData.deploy();

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
});
