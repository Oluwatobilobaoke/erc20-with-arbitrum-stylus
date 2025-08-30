# ERC20 Stylus Integration Scripts

This folder contains TypeScript scripts for interacting with the deployed ERC20 Stylus contract on Arbitrum Sepolia.

## 📋 Prerequisites

1. **Bun Runtime**: Install Bun if you haven't already:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Private Key**: You need a funded wallet on Arbitrum Sepolia
   - Get testnet ETH from: https://www.alchemy.com/faucets/arbitrum-sepolia

## 🚀 Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set your private key as an environment variable:
   ```bash
   export PRIVATE_KEY="your_private_key_without_0x_prefix"
   ```

## 📁 Project Structure

- **`chain.ts`**: Configuration for Arbitrum Sepolia chain and wallet client
- **`abis.ts`**: ERC20 contract ABI definition
- **`erc20.ts`**: Contract instance and helper functions for all ERC20 operations
- **`initialize.ts`**: Script to initialize the token with name and symbol
- **`interact.ts`**: Comprehensive demo script showcasing all contract interactions

## 🎯 Contract Details

- **Contract Address**: `0x5f64ea98806db4492bf6933020b4d1b9b1a0e3dd`
- **Network**: Arbitrum Sepolia (Chain ID: 421614)
- **Explorer**: https://sepolia.arbiscan.io/address/0x5f64ea98806db4492bf6933020b4d1b9b1a0e3dd

## 📝 Available Scripts

### 1. Initialize Token
Initializes the token with a name and symbol (can only be done once):

```bash
export PRIVATE_KEY=your_key bun run initialize
```

This will:
- Initialize the token with name "WHYDEEHEEM" and symbol "YDM"
- Display token information after initialization

### 2. Interact with Token
Demonstrates all ERC20 operations:

```bash
export PRIVATE_KEY=your_key bun run interact
```

This script will:
- Get token information (name, symbol, decimals, total supply)
- Check wallet balance
- Mint new tokens
- Transfer tokens to another address
- Approve token spending
- Burn tokens
- Display final state and transaction summary

## 🔧 Available Functions

The `erc20.ts` module exports these helper functions:

| Function | Description | Parameters |
|----------|-------------|------------|
| `initializeToken()` | Initialize token with name and symbol | `name: string, symbol: string` |
| `getTokenInfo()` | Get token metadata | None |
| `getBalance()` | Check balance of an address | `address: 0x...` |
| `mint()` | Mint new tokens | `to: address, amount: bigint` |
| `transfer()` | Transfer tokens | `to: address, amount: bigint` |
| `approve()` | Approve spending | `spender: address, amount: bigint` |
| `burn()` | Burn tokens | `amount: bigint` |

## 💡 Example Usage

```typescript
import { mint, transfer, getBalance } from "./erc20";
import { parseEther } from "viem";

// Mint 100 tokens
await mint("0xYourAddress", parseEther("100"));

// Transfer 10 tokens
await transfer("0xRecipient", parseEther("10"));

// Check balance
const balance = await getBalance("0xYourAddress");
console.log(`Balance: ${balance}`);
```

## ⚠️ Important Notes

1. **Private Key Security**: Never commit your private key to version control
2. **Gas Fees**: Ensure your wallet has sufficient ETH for gas fees
3. **Initialization**: The token can only be initialized once. If already initialized, the script will show current token info
4. **Decimals**: The token uses 18 decimals (standard for ERC20)

## 🐛 Troubleshooting

- **"Token already initialized"**: The token has already been initialized. Use the interact script instead
- **"Insufficient funds"**: Your wallet needs ETH for gas fees. Get testnet ETH from the faucet
- **"Invalid private key"**: Ensure your private key is correct and doesn't include the "0x" prefix

## 📚 Resources

- [Arbitrum Stylus Documentation](https://docs.arbitrum.io/stylus/stylus-gentle-introduction)
- [Viem Documentation](https://viem.sh/)
- [Arbitrum Sepolia Faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)
- [Arbiscan Testnet Explorer](https://sepolia.arbiscan.io/)