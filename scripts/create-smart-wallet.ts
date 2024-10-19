import { ethers } from "hardhat";
import path from "path";
import fs from "fs";
import { expect } from "chai";

require("dotenv").config();

async function main() {
    const contractAddress = "0xaf3b6ec6b3f5cbf5f731f7ab021226b2b7c7f0b0";

    const abiPath = path.join(__dirname, "../abi/SoulWalletFactory.json");
    const abiFile = fs.readFileSync(abiPath, "utf8");
    const abi = JSON.parse(abiFile).abi; // Ensure you're accessing the correct property

    // Get the signer (account) to interact with the contract
    const [signer] = await ethers.getSigners();

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Set a salt value
    const salt = ethers.ZeroHash;
    const initializer = signer.address;

    contract.on("SoulWalletCreation", (walletAddress) => {
        console.log(`SoulWalletCreation event emitted! Wallet Address: ${walletAddress}`);
    });

    const tx = await contract.createWallet(initializer, salt);

    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    const walletAddress = await contract.getWalletAddress(initializer, salt);

    console.log("Created Wallet Address:", walletAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

