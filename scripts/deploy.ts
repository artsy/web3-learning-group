import { ethers } from "hardhat"

async function main() {
    const Counter = await ethers.getContractFactory("Counter")
    const counter = await Counter.deploy()

    await counter.deployed()

    console.log("deployed to:", counter.address)
    await counter.inc()
    console.log("counter is:", await counter.get())
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
