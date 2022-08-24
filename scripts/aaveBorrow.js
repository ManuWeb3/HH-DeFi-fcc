// imports (ABI's import-path not needed in JS scripts.)
// write main f() that includes our interaction f()
// call main f()

const {getWeth, AMOUNT} = require("../scripts/getWeth")         //  import getWeth() full f(), not just wethBalance var, (that has wethBalance value) from getWeth.js
const {getNamedAccounts, ethers} = require("hardhat")

//  all values returned by the functions below main() will be used inside main() as only main() is being run / exec.
async function main() {

    await getWeth()                                     //  this will run getWeth() in getWeth.js script - 3 outputs
    const {deployer} = await getNamedAccounts()         //  of course, we need this account for interaction

    const lendingPool = await getLendingPool(deployer)  // use await to run a f() incl. in this script

    //  1. Approve before Deposit
    //  But before we deposit any token, we'd need to "approve" (ERC20 wala approve) LendingPool.sol that it can take that AMOUNT from us.
    //  This is per aave docs.

    //  Else, it'll throw an error "Contract not approved to exec. deposit()"
    //  To deposit weth, we need weth-token contract address
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    //  Approve: script below bcz will be used frequently
    await approve(wethTokenAddress, lendingPool.address, AMOUNT, deployer)      // use await to run a f() incl. in this script
    //  Now, run deposit(), finally
    console.log("Depositing now...")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)            //  AMOUNT is ETH, not Weth ???, 
    //  why not tx.wait(1) ?? - recording @ Aug 19. Understand await better, later.
    //  so much so when we used 'await' for borrow()
    console.log("Deposited!!")
    //  what if we gave deployer-address at arg#1 ?? Error is thrown - "unrecognizedContact", means it's looking for only ERC20 type Token contract


    //  2. Borrow:
    //  getuserAccountData()
    //  arg - user address, o/p = 6 values
    //  if we have 1 ETH in collateral DOESN'T mean that we can borrow 1 ETH
    //  LTV: 75% of DAI can be borrowed out of 1 ETH's equivalent value
    let {availableBorrowsETH, totalDebtETH} = await getBorrowUserData(lendingPool, deployer)            //  2 curly braces to save a group of returned vars.
    const daiPrice = await getDaiPrice()
    //  calling these f() will print outputs only.
    //  .toString(), still can do arithmatic ops. But why .toString() needed ?? But why .toSnumber() needed ??
    //  .95 to avoid risk of getting liquidated
    //  reciprocal inside () also works in JS
    //  70% or 95% is under my control, not Aave's, for my safety, not borrowing 100%
    const amountDaiToBorrow = availableBorrowsETH.toString() * (1/daiPrice.toNumber())
    const amountDaiToBorrowWei = await ethers.utils.parseEther(amountDaiToBorrow.toString())        // no more decimal rep. in output
    //  Parse the 'etherString' representation of ether into a BigNumber instance of the amount of wei. I/p must be string.
    //  parseEther => BigNumber (equivalent of wei)
    //  we can pass 'amount" to borrow in the 'borrow()' ONLY as wei, that's why we have to convert into wei
    console.log(`You can borrow ${amountDaiToBorrow} DAI`)
    
    // DAI address
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    await borrowDai(lendingPool, daiAddress, amountDaiToBorrowWei, deployer)      //  'amount' must in wei else error with decimal form (amountDaiToBorrow)
    await getBorrowUserData(lendingPool, deployer)
    //  we're not storing the 2 returned values this time as we do nto need those here, also: no error will be there.

}

async function borrowDai(lendingPool, daiAddress, amountDaiToBorrowWei, account ) {
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrowWei, 1, 0, account)
    await borrowTx.wait(1)
    //  why did we not use wait(1) in deposit() ??? later, after understanding 'await'
    console.log("You've borrowed!!")
}

async function getDaiPrice() {
    //  ABI and Interface can belong to difference contracts but should be related, at the least
    //  (like IERC20.sol was taken instead of IWETH.sol for IWETH.sol's address - only to use .approve()
    //  here 'AggregatorV3Interface.sol' is deployed as a part of 'EACAggregatorProxy.sol' at this address - 0x773616....
    //  Just READING the price does not require 'deployer' - WOW, never knew!!
    //  'deployer' is required to send transactions / run setters
    //  also, 'daiEthPriceFeed' will have access to ONLY AggregatorV3Interface's functions on this address - imp. of using ABI here.
    const daiEthPriceFeed = await ethers.getContractAt("AggregatorV3Interface", "0x773616E4d11A78F511299002da57A0a94577F1f4")
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    //  only save 'answer' value in 'price', answer at index [1]. Total 5 values are supposed to be ret. by latestRD()
    console.log(`The DAI / ETH price is ${price.toString()}`)
    return price
}
    //  getting User's Borrow-data
async function getBorrowUserData(lendingPool, account) {
    //  BorrowData = What you already borrowed, what you can borrow further
    //  just pulling out 3 vars that we need, not all 6
    const {totalCollateralETH, totalDebtETH, availableBorrowsETH } = await lendingPool.getUserAccountData(account)
    
    console.log(`You deposited ${totalCollateralETH} worth of ETH`)
    console.log(`You have already borrowed ${totalDebtETH} worth of ETH`)
    console.log(`You can still borrow ${availableBorrowsETH} worth of ETH`)                 //  82.5% threshold OR ltv ??        
    return {availableBorrowsETH, totalDebtETH}
    //  2 curly braces to return a group of vars.
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

    // generic mechanism to Approve before we deposit()
async function approve(erc20Address, spenderAddress, amountToSpend, account) {
    //  erc20Address - needed to further pass it on into the getContractAt() to get contract abstraction instance of ERC20.sol to run approve f()
    //  spender, amountToSpend will be used inside Approve()
    //  account = deployer everywhere

    //  took IERC20 below instead of IWeth.sol bcz we just need an ERC20 kind of interface here, so IERC20.sol does good.
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account)      // attach erc20Token with deployer
    //  can go with "IWeth.sol" as well bcz IERC20.sol is a subset of IWeth.sol (deposit(), withdraw() are extra)
    //  we only need approve() which is included in the both
    //  MEANS - do not need an EXACT MATCH b/e the Interface and the contract at that address, just the function matters.
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)      //  deployer (msg.sender) is actually running this f()
    //  hence, balance of deployer is in the picture here, in case of only 1 depositor i.e. deployer, bal(WETH9.sol) = bal(deployer)...why?
    //  bcz contract's balance also gets updated with every .deposit() getting run.
    //  Hence, deployer approved LP.sol (spender) to spend AMOUNT on deployer's behalf
    await tx.wait(1)
    console.log("Approved!!")
}

main()
.then(() => process.exit(0))            // if success
.catch(error => {                       // if error
    console.error(error)
    process.exit(1)
})
// won't work with this main(), instead we'll import the getWeth.js script here.


//  Risk parameters analysis:
/*  Loan To value:
    The Loan to Value (LTV) ratio defines the maximum amount of currency that can be borrowed with a specific collateral. 
    It’s expressed in percentage: at LTV=75%, for every 1 ETH worth of collateral, borrowers will be able to borrow 0.75 ETH worth of the corresponding currency. 
    Once a loan is taken, the LTV evolves with market conditions. 
*/

/*  Liquidation Threshold:    
    The liquidation threshold is the percentage at which a loan is defined as undercollateralised. 
    For example, a Liquidation threshold of 80% means that if the value rises above 80% of the collateral, the loan is undercollateralised and could be liquidated.
    The delta between the Loan-To-Value and the Liquidation Threshold is a safety cushion for borrowers.
*/
