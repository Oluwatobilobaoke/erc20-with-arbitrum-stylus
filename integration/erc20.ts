import { getContract } from "viem";
import { walletClient } from "./chain";
import { erc20Abi } from "./abis";

// Your deployed contract address
export const ERC20_CONTRACT_ADDRESS = "0x5f64ea98806db4492bf6933020b4d1b9b1a0e3dd";

// Create contract instance
export const erc20Contract = getContract({
  address: ERC20_CONTRACT_ADDRESS,
  abi: erc20Abi,
  client: walletClient,
});

// Helper functions for interacting with the contract
export async function initializeToken(name: string, symbol: string) {
  try {
    console.log(`\n Initializing token with name: ${name}, symbol: ${symbol}`);
    
    const hash = await erc20Contract.write.initialize([name, symbol]);
    console.log(` Transaction hash: ${hash}`);
    
    console.log(" Waiting for transaction confirmation...");
    const receipt = await walletClient.waitForTransactionReceipt({ hash });
    console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
    
    return receipt;
  } catch (error: any) {
    if (error.message?.includes("InvalidSender")) {
      throw new Error("Token already initialized");
    }
    throw error;
  }
}

export async function getTokenInfo() {
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    erc20Contract.read.name(),
    erc20Contract.read.symbol(),
    erc20Contract.read.decimals(),
    erc20Contract.read.totalSupply(),
  ]);
  
  return {
    name,
    symbol,
    decimals,
    totalSupply,
  };
}

export async function getBalance(address: `0x${string}`) {
  return erc20Contract.read.balanceOf([address]);
}

export async function mint(to: `0x${string}`, amount: bigint) {
  const hash = await erc20Contract.write.mint([to, amount]);
  const receipt = await walletClient.waitForTransactionReceipt({ hash });
  return receipt;
}

export async function transfer(to: `0x${string}`, amount: bigint) {
  const hash = await erc20Contract.write.transfer([to, amount]);
  const receipt = await walletClient.waitForTransactionReceipt({ hash });
  return receipt;
}

export async function approve(spender: `0x${string}`, amount: bigint) {
  const hash = await erc20Contract.write.approve([spender, amount]);
  const receipt = await walletClient.waitForTransactionReceipt({ hash });
  return receipt;
}

export async function burn(amount: bigint) {
  const hash = await erc20Contract.write.burn([amount]);
  const receipt = await walletClient.waitForTransactionReceipt({ hash });
  return receipt;
}