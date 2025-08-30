import { 
  getTokenInfo, 
  getBalance, 
  mint, 
  transfer, 
  approve, 
  burn,
  ERC20_CONTRACT_ADDRESS 
} from "./erc20";
import { walletClient } from "./chain";
import { parseEther, formatEther } from "viem";

async function main() {
  try {
    console.log("=".repeat(60));
    console.log(" ERC20 Token Interaction Demo");
    console.log("=".repeat(60));
    
    const userAddress = walletClient.account.address;
    console.log(`\n Contract Address: ${ERC20_CONTRACT_ADDRESS}`);
    console.log(` User Wallet: ${userAddress}`);
    
    // 1. Get token information
    console.log("\n" + "=".repeat(60));
    console.log(" Getting Token Information...");
    console.log("=".repeat(60));
    
    const tokenInfo = await getTokenInfo();
    console.log(` Token Name: ${tokenInfo.name}`);
    console.log(`  Token Symbol: ${tokenInfo.symbol}`);
    console.log(` Decimals: ${tokenInfo.decimals}`);
    console.log(` Total Supply: ${formatEther(tokenInfo.totalSupply)} ${tokenInfo.symbol}`);
    
    // 2. Check initial balance
    console.log("\n" + "=".repeat(60));
    console.log(" Checking Initial Balance...");
    console.log("=".repeat(60));
    
    const initialBalance = await getBalance(userAddress);
    console.log(`Initial Balance: ${formatEther(initialBalance)} ${tokenInfo.symbol}`);
    
    // 3. Mint tokens
    console.log("\n" + "=".repeat(60));
    console.log(" Minting Tokens...");
    console.log("=".repeat(60));
    
    const mintAmount = parseEther("1000"); // Mint 1000 tokens
    console.log(`Minting ${formatEther(mintAmount)} ${tokenInfo.symbol} to ${userAddress}`);
    
    const mintReceipt = await mint(userAddress, mintAmount);
    console.log(`✅ Mint transaction confirmed in block: ${mintReceipt.blockNumber}`);
    console.log(` Transaction hash: ${mintReceipt.transactionHash}`);
    
    // 4. Check balance after minting
    console.log("\n" + "=".repeat(60));
    console.log(" Checking Balance After Minting...");
    console.log("=".repeat(60));
    
    const balanceAfterMint = await getBalance(userAddress);
    console.log(`Balance after minting: ${formatEther(balanceAfterMint)} ${tokenInfo.symbol}`);
    
    // 5. Transfer tokens to another address
    console.log("\n" + "=".repeat(60));
    console.log(" Transferring Tokens...");
    console.log("=".repeat(60));
    
    const recipientAddress = "0x0000000000000000000000000000000000000001" as `0x${string}`;
    const transferAmount = parseEther("100"); // Transfer 100 tokens
    console.log(`Transferring ${formatEther(transferAmount)} ${tokenInfo.symbol} to ${recipientAddress}`);
    
    const transferReceipt = await transfer(recipientAddress, transferAmount);
    console.log(`✅ Transfer transaction confirmed in block: ${transferReceipt.blockNumber}`);
    console.log(` Transaction hash: ${transferReceipt.transactionHash}`);
    
    // 6. Check balances after transfer
    console.log("\n" + "=".repeat(60));
    console.log(" Checking Balances After Transfer...");
    console.log("=".repeat(60));
    
    const senderBalanceAfterTransfer = await getBalance(userAddress);
    const recipientBalance = await getBalance(recipientAddress);
    console.log(`Sender balance: ${formatEther(senderBalanceAfterTransfer)} ${tokenInfo.symbol}`);
    console.log(`Recipient balance: ${formatEther(recipientBalance)} ${tokenInfo.symbol}`);
    
    // 7. Approve spending
    console.log("\n" + "=".repeat(60));
    console.log("✅ Approving Token Spending...");
    console.log("=".repeat(60));
    
    const spenderAddress = "0x0000000000000000000000000000000000000002" as `0x${string}`;
    const approveAmount = parseEther("50"); // Approve 50 tokens
    console.log(`Approving ${spenderAddress} to spend ${formatEther(approveAmount)} ${tokenInfo.symbol}`);
    
    const approveReceipt = await approve(spenderAddress, approveAmount);
    console.log(`✅ Approve transaction confirmed in block: ${approveReceipt.blockNumber}`);
    console.log(` Transaction hash: ${approveReceipt.transactionHash}`);
    
    // 8. Burn tokens
    console.log("\n" + "=".repeat(60));
    console.log(" Burning Tokens...");
    console.log("=".repeat(60));
    
    const burnAmount = parseEther("50"); // Burn 50 tokens
    console.log(`Burning ${formatEther(burnAmount)} ${tokenInfo.symbol}`);
    
    const burnReceipt = await burn(burnAmount);
    console.log(`✅ Burn transaction confirmed in block: ${burnReceipt.blockNumber}`);
    console.log(` Transaction hash: ${burnReceipt.transactionHash}`);
    
    // 9. Final balance and total supply check
    console.log("\n" + "=".repeat(60));
    console.log(" Final State Check...");
    console.log("=".repeat(60));
    
    const finalBalance = await getBalance(userAddress);
    const finalTokenInfo = await getTokenInfo();
    console.log(`Final user balance: ${formatEther(finalBalance)} ${tokenInfo.symbol}`);
    console.log(`Final total supply: ${formatEther(finalTokenInfo.totalSupply)} ${tokenInfo.symbol}`);
    
    // Summary
    console.log("\n" + "=".repeat(60));
    console.log(" Transaction Summary");
    console.log("=".repeat(60));
    console.log(` Tokens Minted: ${formatEther(mintAmount)} ${tokenInfo.symbol}`);
    console.log(` Tokens Transferred: ${formatEther(transferAmount)} ${tokenInfo.symbol}`);
    console.log(` Tokens Approved: ${formatEther(approveAmount)} ${tokenInfo.symbol}`);
    console.log(` Tokens Burned: ${formatEther(burnAmount)} ${tokenInfo.symbol}`);
    console.log(` Final Balance: ${formatEther(finalBalance)} ${tokenInfo.symbol}`);
    
    console.log("\n" + "=".repeat(60));
    console.log(` View on Arbiscan: https://sepolia.arbiscan.io/address/${ERC20_CONTRACT_ADDRESS}`);
    console.log("=".repeat(60));
    
  } catch (error: any) {
    console.error("\n Error:", error.message);
    if (error.details) {
      console.error("Details:", error.details);
    }
    process.exit(1);
  }
}

main();