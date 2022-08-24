const {getNamedAccounts, ethers, deployments} = require("hardhat")

AMOUNT = ethers.utils.parseEther("0.02")                // "await" not needed to parseEther()
//  Parse the etherString=0.02 representation of ether into a BigNumber instance of the amount of wei. I/p must be string.
//  parseEther => BigNumber (equivalent of wei)
//  let wethString, wethBalance

async function getWeth () {
    
    const {log} = deployments
    log("Yo buddy")
    const {deployer} = await getNamedAccounts()
    //  to interact with any contract, we need ABI and Address and we need deployer to interact with it.
    //  ABI, Address
    //  ABI - Iweth.sol
    //  Address - WETH Mainnet - 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    const iWeth = await ethers.getContractAt("IWeth", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", deployer)   //  attached with deployer
    console.log(`Deployer: ${deployer}`)
    //  getContractAt() returns Promise <Contract> (contract-abstraction in JS), hence overwriting prev. instance.
    //  get me the contract which has this "abi", this "address", and connect it with this "account", dpeloyer
    //  the address has WETH token contract deployed on the mainnet which we're accessing locally thru - HH: Forking mainnet functionlaity
    //  can modularize / parametrize in the config file instead of hard-coding the address in our script, below:
    //  networkConfig[network.config.chainId].wethToken     ??
    
    const tx = await iWeth.deposit({value: AMOUNT})         //  bcz deployer runs all f(), so deployer deposited 0.02 ETH here.
    await tx.wait(1)

    const wethBalance = await iWeth.balanceOf(deployer)     //  deployer's balance, also deplloyer running this f() as well
    //wethString = wethBalance.toString()
    console.log(`Got WETH: ${wethBalance.toString()}`)      // why .toString() needed here ?? It's printing without .toString() as well
    console.log(`===============`)
}

module.exports = {getWeth, AMOUNT}                          // export full function (not just var - wethBalance) to be imported to aaveBorrow.js
//  to be used in erc20Token.approve() in aaveBorrow.js ahead