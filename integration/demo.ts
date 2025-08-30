import { ERC20_CONTRACT_ADDRESS } from "./erc20";

console.log("=".repeat(60));
console.log(" ERC20 Stylus Integration Demo");
console.log("=".repeat(60));

console.log("\n Contract Details:");
console.log(`Address: ${ERC20_CONTRACT_ADDRESS}`);
console.log(`Network: Arbitrum Sepolia (Chain ID: 421614)`);
console.log(`Explorer: https://sepolia.arbiscan.io/address/${ERC20_CONTRACT_ADDRESS}`);

console.log("\n Available Scripts:");
console.log("1. initialize - Initialize the token with name and symbol");
console.log("2. interact - Demonstrate all ERC20 operations");

console.log("\n How to Run:");
console.log("1. Set your private key:");
console.log("   export PRIVATE_KEY='your_private_key_without_0x'");
console.log("\n2. Run initialization (first time only):");
console.log("   bun run initialize");
console.log("\n3. Run interactions:");
console.log("   bun run interact");

console.log("\n Contract Functions Available:");
const functions = [
  { name: "initialize", desc: "Set token name and symbol (one-time)" },
  { name: "name", desc: "Get token name" },
  { name: "symbol", desc: "Get token symbol" },
  { name: "decimals", desc: "Get token decimals (18)" },
  { name: "totalSupply", desc: "Get total token supply" },
  { name: "balanceOf", desc: "Check balance of an address" },
  { name: "transfer", desc: "Transfer tokens to another address" },
  { name: "approve", desc: "Approve spending by another address" },
  { name: "allowance", desc: "Check spending allowance" },
  { name: "transferFrom", desc: "Transfer tokens on behalf of another" },
  { name: "mint", desc: "Create new tokens" },
  { name: "burn", desc: "Destroy tokens" }
];

functions.forEach(fn => {
  console.log(`  • ${fn.name}: ${fn.desc}`);
});

console.log("\n Example Usage in Code:");
console.log(`
import { mint, transfer, getBalance } from "./erc20";
import { parseEther } from "viem";

// Mint 100 tokens
await mint("0xYourAddress", parseEther("100"));

// Transfer 10 tokens  
await transfer("0xRecipient", parseEther("10"));

// Check balance
const balance = await getBalance("0xYourAddress");
console.log(\`Balance: \${balance}\`);
`);

console.log("=".repeat(60));
console.log("  Remember to fund your wallet with testnet ETH!");
console.log("🚰 Faucet: https://www.alchemy.com/faucets/arbitrum-sepolia");
console.log("=".repeat(60));