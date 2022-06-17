const ethers = require("ethers");
const fs = require("fs-extra");

async function main(){
    //compile them in our code
    //compile them separately
    // HTTP://0.0.0.0:7545
    const provider = new ethers.providers.JsonRpcProvider("http://0.0.0.0:7545"); // connection to blockchain
    const wallet = new ethers.Wallet(
        "bdc18aa140576d28a075f48a82ee1288344156891f73dfdcdf939439f0812f1d",
        provider
    ); // creation of wallet need the private key and provider 
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, Please Wait..")
    const contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);
    const currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);
    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const updateFavoriteNumber = await contract.retrieve();
    console.log(`Update Favorite Number: ${updateFavoriteNumber.toString()}`);
 }

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })