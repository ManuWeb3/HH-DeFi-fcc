const {getNamedAccounts, ethers, deployments} = require("hardhat")

AMOUNT = ethers.utils.parseEther("0.02")                // "await" not needed to parseEther()

async function getWeth () {
    
    const {log} = deployments
    const {deployer} = await getNamedAccounts()
    //  to interact with any contract, we need ABI and Address and we need deployer to interact with it.
    //  ABI, Address
    //  ABI - Iweth.sol
    //  Address - WETH Mainnet - 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    const iWeth = await ethers.getContractAt("IWeth", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", deployer)
    console.log(`Deployer: ${deployer}`)
    //  get me the contract which has this "abi", this "address", and connect it with this "account", dpeloyer
    //  the address has WETH token contract deployed on the mainnet which we're accessing locally thru - HH: Forking mainnet functionlaity
    //  can modularize / parametrize in the config file instead of hard-coding the address in our script, below:
    //  networkConfig[network.config.chainId].wethToken     ??

    const tx = await iWeth.deposit({value: AMOUNT})
    await tx.wait(1)

    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got WETH: ${wethBalance.toString()}`)      // why .toString() needed here ?
    console.log(`===============`)
}

module.exports = {getWeth, AMOUNT}                          // export full function (not just var - wethBalance) to be imported to aaveBorrow.js
//  why export AMOUNT specifically when whole getWeth is exported ??