import "dotenv/config"
import { toSafeSmartAccount } from "permissionless/accounts"
import { Hex, createPublicClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { sepolia } from "viem/chains"
import { createPimlicoClient } from "permissionless/clients/pimlico"
import { entryPoint07Address } from "viem/account-abstraction"
import { createSmartAccountClient } from "permissionless"

async function main() {
    // Ensure the private key and Pimlico API key are set
    const apiKey = process.env.PIMLICO_API_KEY
    if (!apiKey) throw new Error("Missing PIMLICO_API_KEY")

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
    if (!privateKey) throw new Error("Missing PRIVATE_KEY")

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http("https://rpc.ankr.com/eth_sepolia"),
    })

    const account = await toSafeSmartAccount({
        client: publicClient,
        owner: privateKeyToAccount(privateKey),
        entryPoint: {
            address: entryPoint07Address,
            version: "0.7"
        }, // global entrypoint
        version: "1.4.1",
    })

    // Create the Pimlico client with EntryPoint v7
    const pimlicoUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`
    const pimlicoClient = createPimlicoClient({
        transport: http(pimlicoUrl),
        entryPoint: {
            address: entryPoint07Address,
            version: "0.7",
        },
    })

    // Create the smart account client, but use SoulWallet's address
    const smartAccountClient = createSmartAccountClient({
        account: account,
        chain: sepolia,
        bundlerTransport: http(pimlicoUrl),
        paymaster: pimlicoClient,
        userOperation: {
            estimateFeesPerGas: async () => {
                return (await pimlicoClient.getUserOperationGasPrice()).fast
            },
        }
    })

    const txHash = await smartAccountClient.sendTransaction({
        to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        value: 0n,
        data: "0x1234",
    })

    console.log(`Transaction Hash: https://sepolia.etherscan.io/tx/${txHash}`)

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });