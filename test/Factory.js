const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Factory", function () {
  const FEE = ethers.parseUnits("0.01", 18);

  const deployFactoryFixture = async () => {
    const [deployer, creator, buyer] = await ethers.getSigners()
    const Factory = await ethers.getContractFactory("Factory")
    const factory = await Factory.deploy(FEE)

    const transaction = await factory.connect(creator).create("TestToken", "TTT", { value: FEE})
    await transaction.wait()
    const tokenAddress = await factory.tokens(0)
    const token = await ethers.getContractAt("Token", tokenAddress);

    return { factory, deployer, creator, buyer, token }
  }

  const buyTokensFixture = async () => {
    const { factory, token, creator, buyer } = await loadFixture(deployFactoryFixture)
    
    const AMOUNT = ethers.parseUnits("10000", 18)
    const COST  = ethers.parseUnits("1", 18)

    const transaction = await factory.connect(buyer).buy(await token.getAddress(), AMOUNT, { value: COST })
    await transaction.wait()
    return { factory, creator, buyer, token }
  }

  describe("Deployment", () => {
    it("Should set the fee", async () => {
      const { factory } = await loadFixture(deployFactoryFixture)
      expect(await factory.fee()).to.equal(FEE)
    })

    it("Should set the owner", async () => {
      const { factory, deployer } = await loadFixture(deployFactoryFixture)
      expect(await factory.owner()).to.equal(deployer.address)
    })
  })

  describe("Creating", () => {
    it("Should set the owner", async () => {
      const { factory, token } = await loadFixture(deployFactoryFixture)
      expect(await token.owner()).to.equal(await factory.getAddress())
    })

    it("Should set the creator", async () => {
      const {  creator, token } = await loadFixture(deployFactoryFixture)
      expect(await token.creator()).to.equal(creator.address)
    })

    it("Should check the fee", async function () {
      const { factory, creator } = await loadFixture(deployFactoryFixture)
      await expect(factory.connect(creator).create("TestToken", "TTT", { value: FEE - ethers.parseUnits("0.01", 18) })).to.be.revertedWith("Insufficient fee")
    })

    it("Should set the supply", async () => {
      const { token } = await loadFixture(deployFactoryFixture)
      const totalSupply = ethers.parseUnits("1000000", 18)
      expect(await token.totalSupply()).to.equal(totalSupply);
    })

    it("Should update ETH balance", async () => {
      const { factory } = await loadFixture(deployFactoryFixture)
      const balance = await ethers.provider.getBalance(await factory.getAddress())
      expect(balance).to.equal(FEE)
    })

    it("Should create the sale", async () => {
      const { token, factory, creator } = await loadFixture(deployFactoryFixture)
      const count = await factory.totalTokens()
      expect(count).to.equal(1)
      const sale = await factory.getTokenSale(0)
      expect(sale.token).to.equal(await token.getAddress())
      expect(sale.creator).to.equal(creator.address)
      expect(sale.sold).to.equal(0)
      expect(sale.raised).to.equal(0)
      expect(sale.isOpen).to.equal(true)
    })
  })

  describe("Buying", () => {
    const AMOUNT = ethers.parseUnits("10000", 18)
    const COST  = ethers.parseUnits("1", 18)

    it("Should update ETH balance", async () => {
      const { factory } = await loadFixture(buyTokensFixture)
      const balance = await ethers.provider.getBalance(await factory.getAddress());
      expect(balance).to.equal(FEE + COST);
    })

    it("Should update token balance", async () => {
      const { token, buyer } = await loadFixture(buyTokensFixture)
      const balance = await token.balanceOf(buyer.address)
      expect(balance).to.equal(AMOUNT)
    })

    it("Should update token sale", async () => {
      const { factory, token } = await loadFixture(buyTokensFixture)
      const sale = await factory.tokenToSale(await token.getAddress())

      expect(sale.sold).to.equal(AMOUNT)
      expect(sale.raised).to.equal(COST)
      expect(sale.isOpen).to.equal(true)
    })

    it("Should increase base cost", async () => {
      const { factory, token } = await loadFixture(buyTokensFixture)
      const sale = await factory.tokenToSale(await token.getAddress())
      const cost = await factory.getCost(sale.sold)

      expect(cost).to.be.equal(ethers.parseUnits('0.0002', 18))
    })

    it("Should check the price", async () => {
      const { factory, token, buyer } = await loadFixture(buyTokensFixture)
      await expect(
        factory.connect(buyer)
        .buy(await token.getAddress(), AMOUNT, { value: COST - ethers.parseUnits("0.01", 18) }))
        .to.be.revertedWith("Insufficient funds")
    })
  })

  describe("Depositing", () => {
    const AMOUNT = ethers.parseUnits("10000", 18)
    const COST  = ethers.parseUnits("2", 18)

    it("Sale should be closed and successfully deposited", async () => {
      const { factory, token, buyer, creator } = await loadFixture(buyTokensFixture)
      const buyTx = await factory.connect(buyer).buy(await token.getAddress(), AMOUNT, { value: COST })
      await buyTx.wait()

      const sale = await factory.tokenToSale(await token.getAddress())
      expect(sale.isOpen).to.equal(false)

      const depositTx = await factory.connect(buyer).deposit(await token.getAddress())
      await depositTx.wait()

      const balance = await token.balanceOf(creator.address)
      expect(balance).to.equal(ethers.parseUnits('980000', 18))
    })
  })

  describe("Withdrawing fees", () => {
    it("Should update ETH balance", async () => {
      const { factory, deployer } = await loadFixture(deployFactoryFixture)
      const transaction = await factory.connect(deployer).withdraw(FEE)
      await transaction.wait()

      const balance = await ethers.provider.getBalance(await factory.getAddress())
      expect(balance).to.equal(0)
    })
  })
})
