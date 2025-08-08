# TrackerAPI - Project Documentation for Claude

## Important Instructions

**CODE LANGUAGE:** ENGLISH ONLY
- ALL code comments must be in English
- ALL console.log messages must be in English  
- ALL error messages must be in English
- NO German comments or strings in code

## Project Overview

**Name:** @a6b8/tracker-api  
**Description:** Node.js module for efficient use of the SolanaTracker API  
**Version:** 0.1.1  
**License:** MIT  
**Author:** a6b8  
**Repository:** https://github.com/a6b8/trackerAPI

### Main Features
- Unified API queries to SolanaTracker
- Preparation and execution of swaps via SolanaTracker API
- WebSocket connections for real-time updates (in development)

## Technical Details

### Stack
- **Sprache:** JavaScript (ES6 Module)
- **Runtime:** Node.js
- **Modul-System:** ESM (.mjs Dateien)
- **Code-Style:** Ohne Semikolons

### Dependencies
- `@solana/web3.js` (^1.95.5) - Solana Blockchain interaction
- `bs58` (^6.0.0) - Base58 Encoding/Decoding
- `inquirer` (^12.1.0) - Interactive CLI prompts
- `ws` (^8.18.0) - WebSocket Client
- **Note:** Native fetch API instead of axios for HTTP requests

### Main Entry Point
- **File:** `src/Interface.mjs`
- **Export:** `TrackerAPI` class (extends EventEmitter)

## Project Structure

```
trackerAPI/
├── src/
│   ├── Interface.mjs          # Main class with public API
│   ├── task/
│   │   ├── Data.mjs          # Data processing and API communication (uses fetch)
│   │   ├── Swap.mjs          # Swap transaction logic (uses fetch)
│   │   ├── Websocket.mjs     # WebSocket implementation
│   │   ├── Validation.mjs    # Input validation
│   │   └── helpers.mjs       # Helper functions
│   └── data/
│       ├── endpoints.mjs     # API endpoint definitions (30+ routes)
│       ├── config.mjs        # Configuration constants
│       ├── paramMetadata.mjs # Parameter metadata for validation
│       ├── rooms.mjs         # WebSocket room definitions
│       └── swap.mjs          # Swap-specific constants
├── tests/
│   ├── 1-all-example-requests.mjs    # API endpoint tests
│   ├── 2-generate-markdown-tables.mjs # Documentation generator
│   ├── 3-swap.mjs                     # Swap functionality tests
│   ├── 4-websockets.mjs               # WebSocket tests
│   └── helpers/utils.mjs              # Test helper functions
├── examples/                   # JSON response examples for all endpoints
├── README.md                   # Main documentation
├── EXAMPLES.md                 # Code examples for all methods
└── package.json

```

## Important Classes and Methods

### TrackerAPI Class

#### Constructor
```javascript
new TrackerAPI({ apiKey, nodeHttp, nodeWs, wsUrl, strictMode })
```
- `apiKey`: SolanaTracker API key (required for getData)
- `nodeHttp`: Solana RPC HTTP endpoint (required for swaps)
- `nodeWs`: Solana RPC WebSocket endpoint
- `wsUrl`: SolanaTracker WebSocket URL
- `strictMode`: Parameter present but currently not implemented (Default: true)

#### Main Methods

##### API Data Query
- `getData({ route, params })` - Executes API requests
- `getRoutes()` - Lists all available API routes
- `getConfig()` / `setConfig()` - Configuration management

##### Swap Functionality
- `getSwapQuote({ from, to, amount, slippage, payer, ... })` - Gets swap quote
- `postSwap({ quote, privateKey, skipConfirmation })` - Executes swap

##### WebSocket
- `cmdWebsocket({ action, params })` - WebSocket commands
  - Actions: 'connect', 'disconnect', 'subscribe', 'unsubscribe'
- Event-based updates via EventEmitter

## API Endpoints

The module supports 30+ API endpoints, including:

### Token Information
- `tokenInformation` - Details about a token
- `tokenHolders` - Top 100 holders
- `tokenTrades` - Latest trades
- `tokenStats` - Statistics over different time periods
- `tokenAth` - All-Time-High price

### Price Data
- `priceInformation` - Current price
- `priceHistory` - Historical prices
- `multiPriceInformation` - Prices for multiple tokens

### Trading Data
- `topTraders` - Most profitable traders
- `profitAndLossData` - PnL for wallets
- `walletTrades` - Trades of a wallet

### Market Overview
- `trendingTokens` - Top 100 trending tokens
- `graduatedTokens` - Pumpfun/Moonshot graduated tokens
- `latestTokens` - Latest 100 tokens

## Development Guidelines

### Architecture Patterns
- **Event-Driven:** Based on Node.js EventEmitter
- **Modular:** Clear separation between Interface, Tasks and Data
- **Validation:** Comprehensive input validation via Validation.mjs
- **Async/Await:** Consistent asynchronous programming
- **Native Fetch:** Uses native fetch API instead of axios

### Code Conventions
- ES6 Modules (.mjs)
- No semicolon style
- Private fields with `#` prefix
- Methods with verb prefix (get, post, cmd, perform)
- Snake_case for file names
- CamelCase for classes and methods
- **ALL COMMENTS IN ENGLISH**

### Test Execution
```bash
# Test all API examples
node tests/1-all-example-requests.mjs

# Generate markdown tables
node tests/2-generate-markdown-tables.mjs

# Test swap functionality
node tests/3-swap.mjs

# WebSocket tests
node tests/4-websockets.mjs
```

## Important Files

### Configuration
- `src/data/config.mjs` - Central configuration constants
- `src/data/endpoints.mjs` - API route definitions with examples
- `src/data/paramMetadata.mjs` - Parameter validation rules

### Validation
- `src/task/Validation.mjs` - Central validation logic
- Checks required/optional parameters
- Type-checking and format validation

### WebSocket
- `src/task/Websocket.mjs` - WebSocket client implementation
- `src/data/rooms.mjs` - Available WebSocket rooms
- Event-based updates for real-time data

## TODO / Open Points

1. **WebSocket functionality:** Still in active development
2. **npm Scripts:** No test scripts defined in package.json
3. **Documentation:** WebSocket events not yet fully documented
4. **strictMode:** Parameter in constructor present but implementation of `#strictMode` method still missing

## Useful Commands

```bash
# Install project
npm install

# Run example
node -e "import('./src/Interface.mjs').then(m => console.log(new m.TrackerAPI({}).getRoutes()))"

# Run tests (manually)
node tests/1-all-example-requests.mjs
```

## Important URLs

- GitHub Repository: https://github.com/a6b8/trackerAPI
- API Documentation: https://www.solanatracker.io
- Example Responses: In `examples/` directory

## Security Notes

- **API Keys:** Never hardcode in code
- **Private Keys:** Only use for swap transactions, never log
- **Validation:** Comprehensive validation via Validation.mjs
- **WebSocket:** Manage connections securely and set timeouts

## Changes

### Version 0.1.1
- Replaced axios with native fetch API
- Changed package name to @a6b8/tracker-api to avoid naming conflicts