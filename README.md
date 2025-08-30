# ERC20 Token Implementation on Arbitrum Stylus

A complete ERC20 token implementation written in Rust for Arbitrum Stylus, featuring owner-controlled minting, self-burning capabilities, and full ERC20 compliance.

## Features

- **Full ERC20 Compliance**: Implements all standard ERC20 functions
- **Owner-Controlled Minting**: Only the contract owner can mint new tokens
- **Self-Burn Mechanism**: Users can burn their own tokens to reduce supply
- **Gas Optimized**: Leverages Rust and WASM for efficient execution on Arbitrum Stylus
- **Type-Safe**: Built with Rust's strong type system for enhanced security

## Contract Overview

The contract implements the following ERC20 functionality based on the [OpenZeppelin ERC20 interface](http://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol):

### Core Functions

- `name()`: Returns the token name
- `symbol()`: Returns the token symbol
- `decimals()`: Returns token decimals (fixed at 18)
- `totalSupply()`: Returns current total supply
- `balanceOf(address)`: Returns balance of an address
- `transfer(to, value)`: Transfer tokens to another address
- `approve(spender, value)`: Approve spending allowance
- `allowance(owner, spender)`: Check spending allowance
- `transferFrom(from, to, value)`: Transfer on behalf of another address

### Additional Functions

- `mint(to, value)`: Mint new tokens (owner only)
- `burn(value)`: Burn tokens from caller's balance

## Quick Start

### Prerequisites

Install Rust and the Stylus CLI:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Stylus CLI
cargo install --force cargo-stylus cargo-stylus-check

# Add WASM target
rustup target add wasm32-unknown-unknown
```

### Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd erc20-stylus
```

### Build & Test

```bash
# Run tests
cargo test

# Build for release
cargo build --release --target wasm32-unknown-unknown

# Check deployment readiness
cargo stylus check
```

## Deployment Process

### Important Note on Constructor Arguments

⚠️ **Known Issue**: The `cargo stylus deploy` command currently has a limitation with constructor arguments ([GitHub Issue #99](https://github.com/OffchainLabs/stylus-sdk-rs/issues/99)). Constructor arguments passed via `--constructor-args` are not properly recognized during deployment.

**Workaround**: Use an initialization pattern instead of a constructor. Deploy the contract first, then call an `initialize` function to set up the token parameters.

### Step 1: Build and Deploy

```bash
# Export ABI
cargo stylus export-abi > abi/erc20.json

# Build for release
cargo build --release --target wasm32-unknown-unknown

# Deploy to Arbitrum Sepolia (without constructor args)
cargo stylus deploy \
  --private-key $PRIVATE_KEY \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc
```

### Step 2: Initialize the Token

After deployment, initialize the token using the integration scripts:

```bash
# Navigate to integration folder
cd integration

# Install dependencies (using Bun)
bun install

# Run initialization script
PRIVATE_KEY=$PRIVATE_KEY bun run initialize.ts
```

### Latest Deployment Results

**Contract Address:** `0x5f64ea98806db4492bf6933020b4d1b9b1a0e3dd`

- **Deployment TX:** `0x6517b72b514976a892fc4fe6978ba806ec6a5b6101ad02c5026be73782f05e85`
- **Activation TX:** `0x7ace9c5c68836ffa1087d38a00726aa154ae47121c6dac04231ee8cfe0306eff`
- **Initialization TX:** `0xed2120ebb082404715fef518d691ded8c3f6f93c0bf5a95ad4480be5f582c81c`

**Token Details:**
- Name: WHYDEEHEEM
- Symbol: YDM
- Decimals: 18

**View on Arbiscan:** https://sepolia.arbiscan.io/address/0x5f64ea98806db4492bf6933020b4d1b9b1a0e3dd

### Integration Setup

The `integration/` folder contains TypeScript scripts using Bun and Viem for interacting with the deployed contract:

```
integration/
├── package.json       # Bun package configuration
├── tsconfig.json      # TypeScript configuration
├── chain.ts          # Chain and wallet configuration
├── abis.ts           # Contract ABI definitions
├── erc20.ts          # ERC20 interaction helpers
└── initialize.ts     # Token initialization script
```

#### Key Integration Features:

1. **Bun Runtime**: Fast JavaScript runtime for quick script execution
2. **Viem Library**: Type-safe Ethereum interactions
3. **Helper Functions**: Pre-built functions for common operations (mint, transfer, burn)

### Alternative: Using Koba for Constructor Support

If you need proper constructor support during deployment, you can use [OpenZeppelin's Koba](https://github.com/OpenZeppelin/koba):

```bash
# Install Koba
npm install -g @openzeppelin/koba

# Deploy with constructor arguments
koba deploy \
  --sol <path-to-constructor> \
  --wasm <path-to-wasm> \
  --args "TokenName" "TKN" \
  -e https://sepolia-rollup.arbitrum.io/rpc \
  --private-key $PRIVATE_KEY
```

## Usage Examples

### Contract Initialization

Since we use an initialization pattern instead of a constructor:

```rust
// In the contract
pub fn initialize(&mut self, name: String, symbol: String) -> Result<(), ERC20Error> {
    // Check if already initialized
    if !self.owner.get().is_zero() {
        return Err(ERC20Error::ERC20InvalidSender(ERC20InvalidSender {
            sender: self.vm().msg_sender(),
        }));
    }
    
    self.name.set_str(name);
    self.symbol.set_str(symbol);
    self.owner.set(self.vm().msg_sender());
    Ok(())
}
```

### Integration Example (Using Viem)

```typescript
// Using the integration scripts
import { initializeToken, mint, transfer, getTokenInfo } from "./erc20";

// Initialize token (one-time operation)
await initializeToken("MyToken", "MTK");

// Get token information
const info = await getTokenInfo();
console.log(info.name, info.symbol);

// Mint tokens (owner only)
await mint("0xRecipientAddress", 1000000n);

// Transfer tokens
await transfer("0xRecipientAddress", 500n);

// Burn tokens
await burn(100n);
```

### Direct Contract Interaction

```javascript
// Using ethers.js or viem directly
const contract = new ethers.Contract(address, abi, signer);

// Initialize (if not already done)
await contract.initialize("TokenName", "TKN");

// Read token info
const name = await contract.name();
const symbol = await contract.symbol();
const supply = await contract.totalSupply();

// Mint tokens (owner only)
await contract.mint(recipient, ethers.parseEther("1000"));

// Transfer tokens
await contract.transfer(recipient, ethers.parseEther("100"));

// Approve and transferFrom
await contract.approve(spender, ethers.parseEther("50"));
```

## Security Features

1. **Owner-Only Minting**: Prevents unauthorized token creation
2. **Self-Burn Only**: Users can only burn their own tokens
3. **Overflow Protection**: Built-in Rust safety prevents integer overflows
4. **Zero Address Checks**: Validates against zero address operations
5. **Allowance Management**: Proper deduction of allowances in transferFrom

## Contract Architecture

```
ERC20 Contract
├── Storage Layer (sol_storage!)
│   ├── owner: address
│   ├── total_supply: uint256
│   ├── name: string
│   ├── symbol: string
│   ├── decimals: uint8
│   ├── balances: mapping(address => uint256)
│   └── allowances: mapping(address => mapping(address => uint256))
│
├── Internal Functions
│   ├── _update(): Core transfer logic with mint/burn
│   ├── _transfer(): Validated transfers
│   ├── _approve(): Set allowances
│   ├── _spend_allowance(): Consume allowances
│   ├── _mint(): Create tokens
│   └── _burn(): Destroy tokens
│
└── Public Interface (#[public])
    ├── Standard ERC20 functions
    └── Extended functionality (mint, burn)
```

## Testing

The contract includes comprehensive test coverage:

```bash
# Run all tests
cargo test

# Run with output
cargo test -- --nocapture

# Run specific test
cargo test test_burn_functionality
```

### Test Results

![Test Results](./img/Screenshot%202025-08-10%20at%2022.56.21.png)

All tests pass successfully, validating:

- Token initialization and metadata
- Owner-controlled minting
- Balance tracking and total supply updates
- Self-burn functionality
- Error handling for insufficient balances

## Gas Optimization

- Uses Stylus SDK's efficient storage patterns
- Optimized WASM compilation with release profile
- Minimal storage operations in transfer logic

## Development

### Project Structure

```
erc20-stylus/
├── src/
│   ├── lib.rs          # Main contract implementation
│   └── main.rs         # Entry point for ABI export
├── integration/        # TypeScript integration scripts
│   ├── package.json    # Bun package configuration
│   ├── tsconfig.json   # TypeScript configuration
│   ├── chain.ts        # Chain and wallet setup
│   ├── abis.ts         # Contract ABI definitions
│   ├── erc20.ts        # Contract interaction helpers
│   ├── initialize.ts   # Token initialization script
│   └── node_modules/   # Dependencies
├── abi/
│   └── erc20.json      # Generated contract ABI
├── img/                # Documentation images
├── Cargo.toml          # Rust dependencies
└── README.md           # This file
```

### Environment Variables

Create a `.env` file:

```
RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
PRIVATE_KEY_PATH=./private_key.txt
CONTRACT_ADDRESS=<deployed_address>
```

## Testnet Information

Deploy to Arbitrum Stylus testnet:

- RPC: https://sepolia-rollup.arbitrum.io/rpc
- Chain ID: 421614
- Explorer: https://sepolia-rollup.arbiscan.io/
- Faucet: https://www.alchemy.com/faucets/arbitrum-sepolia

## Troubleshooting

### Common Issues

#### 1. Constructor Arguments Not Working

**Problem**: Getting error "mismatch number of constructor arguments (want 2; got 0)"

**Cause**: Known limitation in cargo-stylus tool ([Issue #99](https://github.com/OffchainLabs/stylus-sdk-rs/issues/99))

**Solution**: Use the initialization pattern as described in this README:
1. Deploy without constructor arguments
2. Call `initialize()` function after deployment

#### 2. "Token already initialized" Error

**Problem**: Getting "InvalidSender" error when calling initialize

**Cause**: Token has already been initialized (can only be done once)

**Solution**: Check token info to confirm current state:

```typescript
import { getTokenInfo } from "./integration/erc20";
const info = await getTokenInfo();
console.log("Current token:", info);
```

#### 3. Private Key Format Issues

**Problem**: "invalid private key" error in integration scripts

**Solution**: Ensure private key is properly formatted with 0x prefix:

```bash
# Correct format
PRIVATE_KEY=0x1234567890abcdef...

# Run script
PRIVATE_KEY=$PRIVATE_KEY bun run initialize.ts
```

#### 4. Network Connection Issues

**Problem**: RPC connection timeouts or failures

**Solution**: Verify network settings in `integration/chain.ts`:

```typescript
// Check RPC URL is correct
export const ARBITRUM_SEPOLIA_RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";
```

### Getting Help

- [Stylus Documentation](https://docs.arbitrum.io/stylus/)
- [Stylus SDK Issues](https://github.com/OffchainLabs/stylus-sdk-rs/issues)
- [Arbitrum Discord](https://discord.gg/arbitrum)

## License

This project is dual-licensed under MIT OR Apache-2.0.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Built with [Arbitrum Stylus SDK](https://github.com/OffchainLabs/stylus-sdk-rs) for efficient WASM smart contracts on Arbitrum.
