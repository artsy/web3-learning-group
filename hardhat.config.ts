import dotenv from "dotenv"

import { HardhatUserConfig, task } from "hardhat/config"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "solidity-coverage"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    accounts.forEach((account) => {
        console.log(account.address)
    })
})

task("balances", "Prints the list of account balances", async (args, hre) => {
    const accounts: SignerWithAddress[] = await hre.ethers.getSigners()

    await Promise.all(
        accounts.map(async (account) => {
            const balance = await hre.ethers.provider.getBalance(
                account.address
            )
            console.log(`${account.address} has balance ${balance.toString()}`)
        })
    )
})

const config: HardhatUserConfig = {
    solidity: "0.8.11",
    networks: {
        ropsten: {
            url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}/`,
            accounts:
                process.env.PRIVATE_KEY !== undefined
                    ? [process.env.PRIVATE_KEY]
                    : [],
        },
        fuji: {
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            gasPrice: 225000000000,
            chainId: 43113,
            accounts: [],
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
}
export default config
