import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { ArtsyToken, ArtsyToken__factory } from "../typechain"

describe("ArtsyToken", () => {
    let ArtsyToken: ArtsyToken__factory
    let artsyToken: ArtsyToken
    let owner: SignerWithAddress
    let addr1: SignerWithAddress
    let addr2: SignerWithAddress
    let addrs: SignerWithAddress[]

    beforeEach(async () => {
        ArtsyToken = await ethers.getContractFactory("ArtsyToken")
        ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

        artsyToken = await ArtsyToken.deploy()
    })

    describe("deployment", () => {
        it("should show the total supply of tokens", async () => {
            expect(await artsyToken.totalSupply()).to.equal(1_000)
        })

        it("should deploy all tokens to the owner's address", async () => {
            expect(await artsyToken.balanceOf(owner.address)).to.equal(1_000)
        })
    })

    describe("transactions", () => {
        it("should transfer tokens between accounts", async () => {
            // transfer 50 tokens from owner to addr1
            await artsyToken.connect(owner).transfer(addr1.address, 50)
            const addr1Balance = await artsyToken.balanceOf(addr1.address)
            expect(addr1Balance).to.equal(50)

            // transfer 50 tokens from addr1 to addr2
            await artsyToken.connect(addr1).transfer(addr2.address, 50)
            const addr2Balance = await artsyToken.balanceOf(addr2.address)
            expect(addr2Balance).to.equal(50)
        })

        it("should fail if sender doesn’t have enough tokens", async () => {
            const initialAddr2Balance = await artsyToken.balanceOf(
                addr2.address
            )

            await expect(
                artsyToken.connect(addr1).transfer(addr2.address, 1)
            ).to.be.revertedWith("Not enough tokens")
            expect(await artsyToken.balanceOf(addr2.address)).to.equal(
                initialAddr2Balance
            )
        })

        it("should update balances after transfers", async () => {
            const initialOwnerBalance = await artsyToken.balanceOf(
                owner.address
            )

            // transfer 100 tokens from owner to addr1
            await artsyToken.transfer(addr1.address, 100)

            // transfer another 50 tokens from owner to addr2
            await artsyToken.transfer(addr2.address, 50)

            // check balances
            const finalOwnerBalance = await artsyToken.balanceOf(owner.address)
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150))
            const addr1Balance = await artsyToken.balanceOf(addr1.address)
            expect(addr1Balance).to.equal(100)
            const addr2Balance = await artsyToken.balanceOf(addr2.address)
            expect(addr2Balance).to.equal(50)
        })
    })
})
