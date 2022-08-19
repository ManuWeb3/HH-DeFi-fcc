// imports (ABI's import-path not needed in JS scripts.)
// write main f() that includes our interaction f()
// call main f()

const {getWeth} = require("../scripts/getWeth")         //  import getWeth() full f(), not just wethBalance var, (that has wethBalance value) from getWeth.js
const {getNamedAccounts, ethers} = require("hardhat")
const { getContractFactory } = require("@nomiclabs/hardhat-ethers/types")

async function main() {

    await getWeth()                                     //  this will run getWeth() in getWeth.js script - 3 outputs
    const {deployer} = await getNamedAccounts()         //  of course, we need this account for interaction

    const lendingPool = await getLendingPool(deployer)

    //  1. Deposit



}
    //  for DEPOSIT into Aave
    //  deposit() interact in LendingPool.sol
    //  NEED - ABI (Interface), Address (LendingPoolAddressesProvider.sol = 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5)
    //  ILendingPool.sol, create a getter to get LendingPool's address from LPAProvider.sol
    //  3 ways for interface - Patrick Github, Aave Github, create one by yourself
    
    //  below one is a custom f()
async function getLendingPool(account) {            //  this will interact with LPAP.sol, its address + ABI
                                                        //  LPAP.sol is immutable, always safe to get LP.sol's address from it, that too dynamically / programatically.
    const lendingPoolAddressesProvider = await ethers.getContractAt("ILendingPoolAddressesProvider", "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", account)
    //  ABI's import-path not needed in JS scripts.

    //  need ABI and Address of LP.sol to interact with (deposit, etc.)
    //  run yarn for ABI - ILP.sol, why yarn??
    //  bcz it imports 1 interface, that's ok BUT
    //  for DataTypes, better to import the npm pkg of aave/protocol-v2
    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()                       // returns latest address of LendingPool.sol
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)          // returns contract abstraction of LendingPool.sol
    console.log(`LendingPool Address: ${lendingPool.address}`)              // keep it here for tracking the control
    return lendingPool
}

main()
.then(() => process.exit(0))            // if success
.catch(error => {                       // if error
    console.error(error)
    process.exit(1)
})
// won't work with this main(), instead we'll import the getWeth.js script here.