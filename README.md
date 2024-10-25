# ERC 4337 Test

This is simple test project to test ERC 4337 smart wallets.

Try running some of the following tasks:

## Deploy Soul Wallet Contract

1. Clone the repository from Soul Wallet Contract GitHub.
```bash
git clone https://github.com/SoulWallet/soul-wallet-contract
```

2. Deploy the smart wallet on the Sepolia testnet using the default validator EOA.

## Test script 
1. Create a Smart Wallet:
   - Use the factory wallet from the cloned repository to create a new smart wallet.

   ```shell
   npx hardhat run scripts/create-smart-wallet.ts
   ```

2. Transfer ETH:
   - Implement a function to transfer ETH using a bundler (eg. Pimlico/) while ensuring that EntryPoint v7 is used.

   ```shell
   npx hardhat run scripts/transfer-ETH.ts
   ```
