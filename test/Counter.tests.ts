import { expect } from "chai"
import { ethers } from "hardhat"

describe("Counter", () => {
    it("Should keep the count", async () => {
        const Counter = await ethers.getContractFactory("Counter")

        const counter = await Counter.deploy()
        await counter.deployed()
        expect(await counter.get()).to.equal(0)

        await (await counter.inc()).wait()
        expect(await counter.get()).to.equal(1)

        await (await counter.dec()).wait()
        expect(await counter.get()).to.equal(0)
    })
})
