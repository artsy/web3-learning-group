import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { OneToken, OneToken__factory } from "../typechain"

describe("OneToken", () => {
    let OneToken: OneToken__factory
    let oneToken: OneToken
    let owner: SignerWithAddress
    let addr1: SignerWithAddress
    let addr2: SignerWithAddress
    let addrs: SignerWithAddress[]

    beforeEach(async () => {
        OneToken = await ethers.getContractFactory("OneToken")
        ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

        oneToken = await OneToken.deploy()
    })

    describe("deployment and minting", () => {
        it("shows the total supply of tokens", async () => {
            expect(await oneToken.totalSupply()).to.equal(0)
        })

        it("mints tokens one by one", async () => {
            expect(await oneToken.balanceOf(owner.address)).to.equal(0)
            await oneToken.connect(owner).mint(1)
            expect(await oneToken.balanceOf(owner.address)).to.equal(1)
        })

        it("cannot mint more than one", async () => {
            await expect(oneToken.connect(owner).mint(20)).to.be.revertedWith(
                "Can only mint one token"
            )
        })

        it("cannot mint if you already own one", async () => {
            await oneToken.connect(owner).mint(1)
            await expect(oneToken.connect(owner).mint(1)).to.be.revertedWith(
                "May only mint one token at a time"
            )
        })

        it("keeps the total supply correct", async () => {
            await oneToken.connect(owner).mint(1)
            expect(await oneToken.totalSupply()).to.equal(1)
        })
    })

    describe("transactions", () => {
        beforeEach(async () => {
            await oneToken.connect(owner).mint(1)
        })

        it("transfers only one token between accounts", async () => {
            expect(await oneToken.balanceOf(owner.address)).to.equal(1)
            await oneToken.connect(owner).transfer(addr1.address, 1)
            expect(await oneToken.balanceOf(addr1.address)).to.equal(1)
            expect(await oneToken.balanceOf(owner.address)).to.equal(0)
        })

        it("fails if sender doesn’t have enough tokens", async () => {
            expect(await oneToken.balanceOf(owner.address)).to.equal(1)
            await oneToken.connect(owner).transfer(addr1.address, 1)
            expect(await oneToken.balanceOf(addr1.address)).to.equal(1)
            expect(await oneToken.balanceOf(owner.address)).to.equal(0)

            expect(await oneToken.balanceOf(addr2.address)).to.equal(0)
            await expect(
                oneToken.connect(owner).transfer(addr2.address, 1)
            ).to.be.revertedWith("Sender must have at least one token")
            expect(await oneToken.balanceOf(addr2.address)).to.equal(0)
        })

        it("fails if receiver has one token already", async () => {
            expect(await oneToken.balanceOf(owner.address)).to.equal(1)
            await oneToken.connect(owner).transfer(addr1.address, 1)
            expect(await oneToken.balanceOf(addr1.address)).to.equal(1)
            expect(await oneToken.balanceOf(owner.address)).to.equal(0)

            await oneToken.connect(owner).mint(1)

            await expect(
                oneToken.connect(owner).transfer(addr1.address, 1)
            ).to.be.revertedWith("Recipient may have at most one token")
            expect(await oneToken.balanceOf(addr1.address)).to.equal(1)
            expect(await oneToken.balanceOf(owner.address)).to.equal(1)
        })

        it("our helper works", async () => {
            expect(await oneToken.balanceOf(owner.address)).to.equal(1)
            await oneToken.connect(owner).transferOne(addr1.address)
            expect(await oneToken.balanceOf(addr1.address)).to.equal(1)
            expect(await oneToken.balanceOf(owner.address)).to.equal(0)
        })
    })
})
