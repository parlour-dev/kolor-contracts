import { TCPData } from "../types/TCPData";
import { KolorToken } from "../types";

import { expect } from "chai";
import { ethers, upgrades, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const TEN_KOL = ethers.BigNumber.from("10000000000000000000");
const ONE_KOL = ethers.BigNumber.from("1000000000000000000");

describe("TokenAndTCPDataInteractions", function () {
  let tcpdata: TCPData
  let kolor: KolorToken
  let signer: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress

  beforeEach(async () => {
    [ signer, addr1, addr2 ] = await ethers.getSigners()

    const KolorTokenFactory = await ethers.getContractFactory("KolorToken");
    kolor = await upgrades.deployProxy(KolorTokenFactory) as KolorToken;

    const TCPData = await ethers.getContractFactory("TCPData");
    tcpdata = await upgrades.deployProxy(TCPData) as TCPData;

    await kolor.deployed();
    await tcpdata.deployed();
  })

  it("Can be sent to TCPData", async () => {
    await kolor.mint(TEN_KOL)

    // create exactly 6 posts
    for(var i = 0; i < 257; i++)
      await tcpdata.connect(addr2).addContent("{test: 123}");

    const [_, __, idx] = await tcpdata.getLastContent()

    // uint256: 32 bytes, address: 20 bytes
    const idx_packed = ethers.utils.solidityPack(["uint256", "address"], [idx, kolor.address])
    
    await expect(kolor.send(tcpdata.address, ONE_KOL, idx_packed)).to.emit(tcpdata, "ERC777TipReceived").withArgs(idx, addr2.address, ONE_KOL)
    expect(await kolor.balanceOf(addr2.address)).to.equal(ONE_KOL)
    expect(await kolor.balanceOf(signer.address)).to.equal(TEN_KOL.sub(ONE_KOL))

    expect(await kolor.balanceOf(tcpdata.address)).to.equal(0)
  })
});
