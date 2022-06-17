const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main(){
    //compile them in our code
    //compile them separately
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // connection to blockchain
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
     // creation of wallet need the private key and provider 
    let wallet =  new ethers.Wallet.fromEncryptedJsonSync(encryptedJson, process.env.PRIVATE_KEY_PASSWORD);
    wallet = await wallet.connect(provider);
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