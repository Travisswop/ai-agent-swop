## Usage Guide

### Basic Commands

QuantBot understands natural language commands. Here are some examples:

1. **Token Swapping**
   ```
   "I want to swap 1 USDC to SWOP token"
   "Swap 0.5 SOL for USDC"
   ```

2. **Token Transfers**
   ```
   "Send 50 SWOP tokens to address..."
   "Transfer 1 SOL to wallet..."
   ```

3. **Wallet Information**
   ```
   "Show me my wallet address"
   "What's my SOL balance?"
   ```

### Advanced Features

1. **Portfolio Management**
   - View your token holdings
   - Check real-time token prices
   - Monitor portfolio value

2. **Transaction History**
   - View recent transactions
   - Check transaction status
   - Get transaction details

### Safety Tips

1. **Always verify transactions**
   - Double-check addresses before confirming
   - Verify token amounts and prices
   - Ensure you have enough SOL for gas fees

2. **Wallet Security**
   - Never share your private key
   - Use a dedicated wallet for testing
   - Keep your seed phrase secure

## Solana Agent Kit Integration

QuantBot uses Solana Agent Kit to:
- Execute token swaps
- Perform token transfers
- Check wallet balances
- Interact with Solana programs
- Handle transaction signing

### Available Tools

The bot has access to these Solana Agent Kit tools:
- `getBalance` - Check token balances
- `transfer` - Send tokens
- `swap` - Exchange tokens
- `getPrice` - Get token prices
- `getTokenAccounts` - List token accounts

## Error Handling

Common error messages and solutions:

1. **Insufficient Balance**
   ```
   "Error: Insufficient funds for transaction"
   Solution: Ensure you have enough SOL for gas fees
   ```

2. **Invalid Address**
   ```
   "Error: Invalid address format"
   Solution: Double-check the wallet address
   ```

3. **RPC Error**
   ```
   "Error: RPC request failed"
   Solution: Check your internet connection or try a different RPC endpoint
   ```

## Development

To extend the bot's capabilities:

1. Add new tools to `createSolanaTools`:
