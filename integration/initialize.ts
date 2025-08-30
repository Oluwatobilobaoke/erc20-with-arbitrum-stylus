import { initializeToken, getTokenInfo } from "./erc20";
import { walletClient } from "./chain";

async function main() {
  try {
    console.log("=".repeat(50));
    console.log("ERC20 Token Initialization Script");
    console.log("=".repeat(50));

    console.log(
      `\n📍 Contract Address: 0x5f64ea98806db4492bf6933020b4d1b9b1a0e3dd`
    );
    console.log(`👤 Initializing with wallet: ${walletClient.account.address}`);

    // Initialize the token
    await initializeToken("WHYDEEHEEM", "YDM");

    // Verify initialization by reading token info
    console.log("\nVerifying initialization...");
    const tokenInfo = await getTokenInfo();

    console.log("\n✨ Token successfully initialized!");
    console.log("=".repeat(50));
    console.log(`Token Name: ${tokenInfo.name}`);
    console.log(`Token Symbol: ${tokenInfo.symbol}`);
    console.log(`Decimals: ${tokenInfo.decimals}`);
    console.log(`Total Supply: ${tokenInfo.totalSupply}`);
    console.log("=".repeat(50));

    console.log(
      `\n View on Arbiscan: https://sepolia.arbiscan.io/address/0x5f64ea98806db4492bf6933020b4d1b9b1a0e3dd`
    );
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);

    if (error.message === "Token already initialized") {
      console.log("\n Token is already initialized. Reading current info...");
      const tokenInfo = await getTokenInfo();
      console.log(` Token Name: ${tokenInfo.name}`);
      console.log(`  Token Symbol: ${tokenInfo.symbol}`);
      console.log(` Decimals: ${tokenInfo.decimals}`);
      console.log(` Total Supply: ${tokenInfo.totalSupply}`);
    }

    process.exit(1);
  }
}

main();
