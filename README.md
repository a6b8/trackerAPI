[![CircleCI](https://img.shields.io/circleci/build/github/a6b8/trackerAPI/main)]() ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# TrackerAPI

**Package Name:** `@a6b8/tracker-api`

This module enables efficient and easy use of the `SolanaTracker API`.

## Features

**The following features are available:**
- **Data Methods:** Unified API querying with queryData() and route discovery
- **Trading Methods:** Preparing and performing swaps with the SolanaTracker API  
- **WebSocket Methods:** Real-time connections with filtering and room management
- **Event-Driven Methods:** Asynchronous operations with progress events and flexible error handling
- **Core Methods:** Configuration management and health monitoring

## Installation

```bash
npm install @a6b8/tracker-api
```

## Quickstart

1. Create an account on `https://www.solanatracker.io` and generate an API key.
2. Install the package using npm.

### Basic Data Query
```js
import { TrackerAPI, examples } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 
  'apiKey': `{{your_api_key}}`
})
const { route, params } = examples[0]
const response = await st.queryData({ route, params })
console.log(response)
```

### Event-Driven Operations  
```js
// Listen for events
st.on('collection', (data) => {
  console.log(`Status: ${data.status}`)
})

// Execute multiple API calls with progress tracking
st.performDataCollection({
  batch: [
    { route: 'tokenInformation', params: { tokenAddress: 'SOL-address' }},
    { route: 'priceInformation', params: { token: 'USDC-address' }}
  ],
  onError: 'continue'  // Continue on validation errors
})
```

### WebSocket Real-time Data
```js
const st = new TrackerAPI({ wsUrl: '{{websocket_url}}' })

// Connect and subscribe to token events
st.connectWebsocket()
st.updateWebsocketRoom({
  roomId: 'graduatingTokens', 
  type: 'join',
  params: { poolId: 'your-pool-id' }
})

// Listen for real-time events
st.on('graduatingTokens', (tokenData) => {
  console.log('New token graduated:', tokenData)
})
```

## Table of Contents
- [TrackerAPI](#trackerapi)
  - [Features](#features)
  - [Quickstart](#quickstart)
  - [Table of Contents](#table-of-contents)
  - [Core API Methods](#core-api-methods)
    - [constructor()](#constructor)
    - [.health()](#health)
    - [.getConfig()](#getconfig)
    - [.setConfig()](#setconfig)
  - [Data Methods](#data-methods)
    - [.queryData()](#querydata)
    - [.getDataRoutes()](#getdataroutes)
  - [Trading Methods](#trading-methods)
    - [.getSwapQuote()](#getswapquote)
    - [.postSwapTransaction()](#postswaptransaction)
  - [WebSocket Methods](#websocket-methods)
    - [.connectWebsocket()](#connectwebsocket)
    - [.addWebsocketFilter()](#addwebsocketfilter)
    - [.addWebsocketModifier()](#addwebsocketmodifier)
    - [.updateWebsocketRoom()](#updatewebsocketroom)
  - [Event-Driven Methods](#event-driven-methods)
    - [.performDataCollection()](#performdatacollection)
    - [.performSwap()](#performswap)
  - [Routes](#routes)
  - [License](#license)

## Core API Methods

### constructor()

This method initializes the class.

**Method**
```js
.constructor({ apiKey, nodeHttp, nodeWs, wsUrl })
```

| Key       | Type   | Description                                                                                                                             | Required |
|-----------|--------|-----------------------------------------------------------------------------------------------------------------------------------------|----------|
| apiKey    | string | Sets the `apiKey` for the SolanaTracker API. If not provided, data methods will not be available.                                      | No (recommended) |
| nodeHttp  | string | Solana RPC HTTP endpoint. Required for swap transactions.                                                                                 | No (recommended) |
| nodeWs    | string | Solana RPC WebSocket endpoint. Required for swap transaction confirmations.                                                               | No |
| wsUrl     | string | SolanaTracker WebSocket URL. Required for WebSocket functionality.                                                                        | No |

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 
  'apiKey': '{{your_api_key}}',
  'nodeHttp': '{{my_solana_http_node}}',
  'nodeWs': '{{my_solana_ws_node}}',
  'wsUrl': '{{tracker_websocket_url}}'
})
```

**Returns**
```js
true
```

### .health()

This method returns the health status of the TrackerAPI instance.

**Method**
```js
.health()
```

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 'apiKey': '{{your_api_key}}' })
console.log(st.health())
```

**Returns**
```js
true
```

### .getConfig()

This method returns the current configuration of the TrackerAPI instance.

**Method**
```js
.getConfig()
```

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 'apiKey': '{{your_api_key}}' })
const config = st.getConfig()
console.log(config)
```

**Returns**
```js
Object // Current configuration object
```

### .setConfig()

This method updates the configuration of the TrackerAPI instance.

**Method**
```js
.setConfig({ config })
```

| Key    | Type   | Description                    | Required |
|--------|--------|--------------------------------|----------|
| config | object | New configuration object       | Yes      |

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 'apiKey': '{{your_api_key}}' })
st.setConfig({ config: newConfigObject })
```

**Returns**
```js
true
```

## Data Methods

### .queryData()

This method creates, sends, and evaluates requests to the SolanaTracker API.

**Method**
```js
async .queryData({ route, params })
```

| Key     | Type   | Description                                                                                                           | Required |
|---------|--------|-----------------------------------------------------------------------------------------------------------------------|----------|
| route   | string | Specifies the method to query. A list of methods can be found under [routes](#routes).                               | Yes      |
| params  | object | Parameters can be passed here. Required parameters can be found under [routes](#routes).                             | Yes      |

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 
  'apiKey': '{{your_api_key}}' 
})
await st.queryData({
  'route': 'search',
  'params': {
    'query': 'GOAT'
  }
})
```

**Returns**
```js
Object
```

### .getDataRoutes()

This helper function displays all available routes for queryData(). A list is also available under [routes](#routes).

**Method**
```js
.getDataRoutes()
```

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 
  'apiKey': '{{your_api_key}}' 
})
console.log(st.getDataRoutes())
```

**Returns**
```js
Array of Strings
```

## Trading Methods


### .getSwapQuote()

This method retrieves a quote for a swap transaction without executing it. Use with `.postSwapTransaction()` for more control.

**Method**
```js
async .getSwapQuote( params, id )
```

| Key    | Type   | Description                                               | Required |
|--------|--------|-----------------------------------------------------------|----------|
| params | object | Swap parameters (same as performSwap params object)      | Yes      |
| id     | string | Optional identifier for tracking (default: 'n/a')       | No       |

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 
  'nodeHttp': '{{my_solana_http_node}}',
  'nodeWs': '{{my_solana_ws_node}}'
})

const quote = await st.getSwapQuote({
  'from': 'So11111111111111111111111111111111111111112', // SOL
  'to': 'UEPp8H46WkPiBmi7nw35nyfFDNpxp9LWRPxSMHXpump',
  'amount': 0.0001,
  'slippage': 15,
  'payer': '{{my_public_key}}',
  'priorityFee': 0.0005
})

console.log('Quote:', quote)
```

**Returns**
```js
{ 
  status: boolean, 
  messages: Array, 
  data: Object, // Quote data with transaction details
  id: string 
}
```

### .postSwapTransaction()

This method executes a previously obtained swap quote. Must be used after `.getSwapQuote()`.

**Method**
```js
async .postSwapTransaction({ quote, privateKey, skipConfirmation })
```

| Key              | Type    | Description                                               | Required |
|------------------|---------|-----------------------------------------------------------|----------|
| quote            | object  | Quote object returned from getSwapQuote()               | Yes      |
| privateKey       | string  | Private key for transaction signing                      | Yes      |
| skipConfirmation | boolean | Skip user confirmation prompt (default: false)          | No       |

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 
  'nodeHttp': '{{my_solana_http_node}}',
  'nodeWs': '{{my_solana_ws_node}}'
})

// First get quote
const quote = await st.getSwapQuote({
  'from': 'So11111111111111111111111111111111111111112',
  'to': 'UEPp8H46WkPiBmi7nw35nyfFDNpxp9LWRPxSMHXpump',
  'amount': 0.0001,
  'slippage': 15,
  'payer': '{{my_public_key}}'
})

// Review quote, then execute
if (quote.status) {
  const result = await st.postSwapTransaction({
    quote,
    'privateKey': '{{my_private_key}}',
    'skipConfirmation': false
  })
  
  console.log('Swap result:', result)
}
```

**Returns**
```js
{ 
  data: {
    status: boolean,
    messages: Array,
    data: {
      request: Object,
      quote: Object,
      swap: {
        id: string,    // Transaction ID
        tx: Object     // Transaction object
      }
    },
    id: string
  }
}
```

## WebSocket Methods

### .connectWebsocket()

This method establishes a connection to the SolanaTracker WebSocket server.

**Method**
```js
.connectWebsocket()
```

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 
  'wsUrl': '{{tracker_websocket_url}}'
})
const result = st.connectWebsocket()
console.log(result)
```

**Returns**
```js
{ status: boolean, messages: Array, data: Object }
```

### .addWebsocketFilter()

This method creates a filter function that can be used to filter WebSocket messages.

**Method**
```js
.addWebsocketFilter({ funcName, func })
```

| Key      | Type     | Description                                    | Required |
|----------|----------|------------------------------------------------|----------|
| funcName | string   | Name identifier for the filter function       | Yes      |
| func     | function | Filter function that returns true/false       | Yes      |

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 'wsUrl': '{{tracker_websocket_url}}' })

const pumpFilter = st.addWebsocketFilter({
  'funcName': 'isPumpFun',
  'func': (data) => data.token.createdOn === 'https://pump.fun'
})
```

**Returns**
```js
{ funcName: string, func: function, type: 'filter' }
```

### .addWebsocketModifier()

This method creates a modifier function that transforms WebSocket message data.

**Method**
```js
.addWebsocketModifier({ funcName, func })
```

| Key      | Type     | Description                                    | Required |
|----------|----------|------------------------------------------------|----------|
| funcName | string   | Name identifier for the modifier function     | Yes      |
| func     | function | Modifier function that transforms data        | Yes      |

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 'wsUrl': '{{tracker_websocket_url}}' })

const dataModifier = st.addWebsocketModifier({
  'funcName': 'extractEssentials',
  'func': (data) => ({
    name: data.token.name,
    mint: data.token.mint,
    price: data.price
  })
})
```

**Returns**
```js
{ funcName: string, func: function, type: 'modifier' }
```

### .updateWebsocketRoom()

This method joins or leaves WebSocket rooms with optional filtering and data modification.

**Method**
```js
.updateWebsocketRoom({ roomId, type, params, filters, modifiers })
```

| Key       | Type   | Description                                         | Required |
|-----------|--------|-----------------------------------------------------|----------|
| roomId    | string | The room to join/leave                             | Yes      |
| type      | string | Action type: 'join' or 'leave'                    | Yes      |
| params    | object | Parameters for the room (e.g., tokenId, poolId)   | No       |
| filters   | array  | Array of filter objects from addWebsocketFilter() | No       |
| modifiers | array  | Array of modifier objects from addWebsocketModifier() | No   |

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 'wsUrl': '{{tracker_websocket_url}}' })

// Create filters and modifiers
const filter1 = st.addWebsocketFilter({
  'funcName': 'isPumpFun',
  'func': (data) => data.token.createdOn === 'https://pump.fun'
})

const modifier1 = st.addWebsocketModifier({
  'funcName': 'extractEssentials',
  'func': (data) => ({ name: data.token.name, mint: data.token.mint })
})

// Join room with filters and modifiers
st.updateWebsocketRoom({
  'roomId': 'graduatingTokens',
  'type': 'join',
  'params': { poolId: 'GmJaZvdNptvofC4qe3tvuBNgqLm65p1of5pk6JFHpump' },
  'filters': [filter1],
  'modifiers': [modifier1]
})

// Listen for events
st.on('graduatingTokens', (data) => {
  console.log('Filtered and modified data:', data)
})
```

**Returns**
```js
{ status: boolean, messages: Array, data: Object }
```

## Event-Driven Methods

These methods perform asynchronous operations and emit events through the EventEmitter pattern. Listen for events using `.on(eventName, callback)`.

### .performDataCollection()

Executes multiple API requests in parallel and emits progress events throughout the process.

**Method**
```js
.performDataCollection({ batch, onError })
```

| Key     | Type   | Description                                    | Required |
|---------|--------|------------------------------------------------|----------|
| batch   | array  | Array of request objects with route and params | Yes      |
| onError | string | Error handling mode: 'throw' or 'continue' (default: 'throw') | No |

**Events Emitted:**
- `collection` - Emitted during different stages of the collection process

**Event Data Structure:**
```js
{
  id: string,           // Unique operation ID
  status: string,       // 'started', 'progress', 'completed', 'error'
  total?: number,       // Total number of requests (on 'started')
  completed?: number,   // Number completed so far (on 'progress')
  result?: object,      // Individual result (on 'progress')
  results?: array,      // All results (on 'completed')
  error?: string        // Error message (on 'error')
}
```

**Example**
```js
import { TrackerAPI } from '@a6b8/tracker-api'
const st = new TrackerAPI({ 
  'apiKey': '{{your_api_key}}' 
})

// Listen for collection events
st.on('collection', (data) => {
  console.log(`Operation ${data.id} - Status: ${data.status}`)
  
  if (data.status === 'started') {
    console.log(`Starting collection of ${data.total} requests`)
  } else if (data.status === 'progress') {
    console.log(`Progress: ${data.completed}/${data.total} completed`)
    console.log('Latest result:', data.result)
  } else if (data.status === 'completed') {
    console.log('All requests completed:', data.results)
  } else if (data.status === 'error') {
    console.error('Collection failed:', data.error)
  }
})

// Start data collection (throw on error - default)
st.performDataCollection({
  batch: [
    { route: 'tokenInformation', params: { tokenAddress: 'So11111111111111111111111111111111111111112' }},
    { route: 'priceInformation', params: { token: 'So11111111111111111111111111111111111111112' }},
    { route: 'tokenHolders', params: { tokenAddress: 'So11111111111111111111111111111111111111112' }}
  ],
  onError: 'throw'  // Will throw error on invalid batch data
})

// Alternative: Continue on validation errors (for event-driven systems)
st.performDataCollection({
  batch: eventData,  // Data from external source - might be invalid
  onError: 'continue'  // Will emit error event but continue program execution
})
```

**Returns**
```js
{ status: boolean, data: Array, id: string }
```

### .performSwap()

Performs a complete swap transaction asynchronously and emits events during the process. This is the event-driven version of the synchronous swap methods.

**Method**
```js
.performSwap({ params, privateKey, skipConfirmation, onError })
```

| Key              | Type    | Description                                               | Required |
|------------------|---------|-----------------------------------------------------------|----------|
| params           | object  | Swap parameters (from, to, amount, slippage, payer, etc.) | Yes      |
| privateKey       | string  | Private key for transaction signing                       | Yes      |
| skipConfirmation | boolean | Skip user confirmation prompt (default: false)           | No       |
| onError          | string  | Error handling mode: 'throw' or 'continue' (default: 'throw') | No |

**Events Emitted:**
- `swap` - Emitted when swap quote is retrieved and transaction is executed, or on validation errors

**Event Data Structure:**
```js
{
  id: string,           // Unique operation ID
  eventStatus: string,  // 'getQuote' or 'error'
  quote?: object,       // Quote data and transaction result (on success)
  error?: Array         // Error messages (on validation failure)
}
```

**Example**
```js
st.on('swap', (data) => {
  if (data.eventStatus === 'getQuote') {
    console.log('Swap completed:', data.quote)
  } else if (data.eventStatus === 'error') {
    console.error('Swap validation failed:', data.error)
  }
})

// Default behavior - throw on validation errors
const swapId = st.performSwap({
  params: {
    from: 'So11111111111111111111111111111111111111112',
    to: 'UEPp8H46WkPiBmi7nw35nyfFDNpxp9LWRPxSMHXpump',
    amount: 0.001,
    slippage: 15,
    payer: '{{your_public_key}}'
  },
  privateKey: '{{private_key}}',
  onError: 'throw'  // Will throw error on invalid params
})

// Event-driven behavior - continue on validation errors
const swapId = st.performSwap({
  params: eventTradeData,  // Data from copy-trading event - might be invalid
  privateKey: '{{private_key}}',
  onError: 'continue'  // Will emit error event but continue program
})
```


## Routes

This overview provides a list of all available methods and their descriptions.

| Key | Description | Route | Example | Response |
| --- | --- | --- |--- |--- |
| chartData |  | GET /chart/{token} | [X](./EXAMPLES.md?#chartData) | [X](./examples/chartData.json) |
| chartDataByPool | Get OLCVH (Open, Low, Close, Volume, High) data for charts. | GET /chart/{token}/{pool} | [X](./EXAMPLES.md?#chartDataByPool) | [X](./examples/chartDataByPool.json) |
| firstBuyersOfToken | Retrieve the first 100 buyers of a token (since API started recording data) with Profit and Loss data for each wallet. | GET /first-buyers/{token} | [X](./EXAMPLES.md?#firstBuyersOfToken) | [X](./examples/firstBuyersOfToken.json) |
| graduatedTokens | Overview of all graduated pumpfun/moonshot tokens (Pumpvision / Photon Memescope style). | GET /tokens/multi/graduated | [X](./EXAMPLES.md?#graduatedTokens) | [X](./examples/graduatedTokens.json) |
| latestTokens | Retrieve the latest 100 tokens. | GET /tokens/latest | [X](./EXAMPLES.md?#latestTokens) | [X](./examples/latestTokens.json) |
| multiPriceInformation | Get price information for multiple tokens (up to 100). | GET /price/multi | [X](./EXAMPLES.md?#multiPriceInformation) | [X](./examples/multiPriceInformation.json) |
| multiTokenInformation | Get an overview of latest, graduating, and graduated tokens (Pumpvision / Photon Memescope style). | GET /tokens/multi/all | [X](./EXAMPLES.md?#multiTokenInformation) | [X](./examples/multiTokenInformation.json) |
| paginatedTopTraders | Get the most profitable traders across all tokens, with optional pagination. | GET /top-traders/all/{page} | [X](./EXAMPLES.md?#paginatedTopTraders) | [X](./examples/paginatedTopTraders.json) |
| pnlForSpecificToken | Get Profit and Loss data for a specific token in a wallet. | GET /pnl/{wallet}/{token} | [X](./EXAMPLES.md?#pnlForSpecificToken) | [X](./examples/pnlForSpecificToken.json) |
| postMultiPrice | Similar to GET /price/multi, but accepts an array of token addresses in the request body. | POST /price/multi | [X](./EXAMPLES.md?#postMultiPrice) | [X](./examples/postMultiPrice.json) |
| postPrice | Similar to GET /price, but accepts token address in the request body. | POST /price | [X](./EXAMPLES.md?#postPrice) | [X](./examples/postPrice.json) |
| priceHistory | Get historic price information for a single token. | GET /price/history | [X](./EXAMPLES.md?#priceHistory) | [X](./examples/priceHistory.json) |
| priceInformation | Get price information for a single token. | GET /price | [X](./EXAMPLES.md?#priceInformation) | [X](./examples/priceInformation.json) |
| profitAndLossData | Get Profit and Loss data for all positions of a wallet. | GET /pnl/{wallet} | [X](./EXAMPLES.md?#profitAndLossData) | [X](./examples/profitAndLossData.json) |
| search | The /search endpoint provides a flexible search interface for pools and tokens with support for multiple filtering criteria and pagination. | GET /search | [X](./EXAMPLES.md?#search) | [X](./examples/search.json) |
| tokenAth | Retrieve the all time high price of a token (since data api started recording) | GET /tokens/{tokenAddress}/ath | [X](./EXAMPLES.md?#tokenAth) | [X](./examples/tokenAth.json) |
| tokenHolders | Get the top 100 holders for a specific token. | GET /tokens/{tokenAddress}/holders | [X](./EXAMPLES.md?#tokenHolders) | [X](./examples/tokenHolders.json) |
| tokenInformation | Retrieve all information for a specific token. | GET /tokens/{tokenAddress} | [X](./EXAMPLES.md?#tokenInformation) | [X](./examples/tokenInformation.json) |
| tokenStats | Get detailed stats for a token over various time intervals. | GET /stats/{token} | [X](./EXAMPLES.md?#tokenStats) | [X](./examples/tokenStats.json) |
| tokenStatsByPool | Get detailed stats for a token-pool pair over various time intervals. | GET /stats/{token}/{pool} | [X](./EXAMPLES.md?#tokenStatsByPool) | [X](./examples/tokenStatsByPool.json) |
| tokenTrades | Get the latest trades for a token across all pools. | GET /trades/{tokenAddress} | [X](./EXAMPLES.md?#tokenTrades) | [X](./examples/tokenTrades.json) |
| tokenTradesByPool | Get the latest trades for a specific token and pool pair. | GET /trades/{tokenAddress}/{poolAddress} | [X](./EXAMPLES.md?#tokenTradesByPool) | [X](./examples/tokenTradesByPool.json) |
| tokenTradesByPoolAndOwner | Get the latest trades for a specific token, pool, and wallet address. | GET /trades/{tokenAddress}/{poolAddress}/{owner} | [X](./EXAMPLES.md?#tokenTradesByPoolAndOwner) | [X](./examples/tokenTradesByPoolAndOwner.json) |
| tokenVolume | Retrieve the top 100 tokens sorted by highest volume. | GET /tokens/volume | [X](./EXAMPLES.md?#tokenVolume) | [X](./examples/tokenVolume.json) |
| topTraders | Get the most profitable traders | GET /top-traders/all | [X](./EXAMPLES.md?#topTraders) | [X](./examples/topTraders.json) |
| topTradersForToken | Get top 100 traders by PnL for a token. | GET /top-traders/{token} | [X](./EXAMPLES.md?#topTradersForToken) | [X](./examples/topTradersForToken.json) |
| tradesByWallet | Get the latest trades for a specific token and wallet address. | GET /trades/{tokenAddress}/by-wallet/{owner} | [X](./EXAMPLES.md?#tradesByWallet) | [X](./examples/tradesByWallet.json) |
| trendingTokens | Get the top 100 trending tokens based on transaction volume in the past hour. | GET /tokens/trending | [X](./EXAMPLES.md?#trendingTokens) | [X](./examples/trendingTokens.json) |
| trendingTokensByTimeframe | Returns trending tokens for a specific time interval. | GET /tokens/trending/{timeframe} | [X](./EXAMPLES.md?#trendingTokensByTimeframe) | [X](./examples/trendingTokensByTimeframe.json) |
| walletInformation | Get all tokens in a wallet with current value in USD. | GET /wallet/{owner} | [X](./EXAMPLES.md?#walletInformation) | [X](./examples/walletInformation.json) |
| walletTrades | Get the latest trades of a wallet. | GET /wallet/{owner}/trades | [X](./EXAMPLES.md?#walletTrades) | [X](./examples/walletTrades.json) |


## License

This project is licensed under the MIT License. Details can be found in the [LICENSE](LICENSE) file.