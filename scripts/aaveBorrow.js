// imports
// write main f()
// call main f()

const {getWeth} = require("../scripts/getWeth")         // import getWeth() full f(), not just wethBalance var, (that has wethBalance value) from getWeth.js

async function main() {

    await getWeth()                                     // this will run getWeth() in getWeth.js script
}

main()
.then(() => process.exit(0))            // if success
.catch(error => {                     // if error
    console.error(error)
    process.exit(1)
})
// won't work with this main(), instead we'll import the getWeth.js script here.