[![CircleCI](https://img.shields.io/circleci/build/github/a6b8/solanaTracker/main)]() ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# TrackerAPI

This module enables efficient and easy use of the `SolanaTracker API`.

## Features

**The following features are available:**
- Unified API querying.
- Preparing and performing swaps with the `SolanaTracker API`.
- *(In Progress)* Establishing and updating WebSocket connections.

## Quickstart

1. Create an account on `https://www.solanatracker.io` and generate an API key.
2. Download the repository.

```js
import { TrackerAPI, examples } from '../src/index.mjs'
const st = new TrackerAPI({ 
  'apiKey': `{{your_api_key}}`
})
const { route, params } = examples[0]
const response = await st.request({ route, params })
console.log(response)
```

## Table of Contents
- [TrackerAPI](#trackerapi)
  - [Features](#features)
  - [Quickstart](#quickstart)
  - [Table of Contents](#table-of-contents)
  - [Methods](#methods)
    - [constructor()](#constructor)
    - [.getData()](#getdata)
    - [.getRoutes()](#getroutes)
    - [.getSwapQuote()](#getswapquote)
    - [.postSwap()](#postswap)
  - [Routes](#routes)
  - [License](#license)

## Methods

### constructor()

This method initializes the class.

**Method**
```js
.constructor({ apiKey, nodeUrl })
```

| Key       | Type   | Description                                                                                                                             | Required |
|-----------|--------|-----------------------------------------------------------------------------------------------------------------------------------------|----------|
| apiKey    | string | Sets the `apiKey` for the SolanaTracker API. If not provided, the `.getData()` method will not be available.                             | No (recommended) |
| nodeUrl   | string | Required, for example, to send transactions. If no `nodeUrl` is set, `.getSwapQuote` and `.postSwap` cannot be used.                     | No (recommended) |

**Example**
```js
import { TrackerAPI } from './src/index.mjs'
const st = new TrackerAPI({ 
  'apiKey': '{{your_api_key}}',
  'nodeUrl': '{{my_solana_node}}'  
})
```

**Returns**
```js
true
```

### .getData()

This method creates, sends, and evaluates requests to the SolanaTracker API.

**Method**
```js
async .getData({ route, params })
```

| Key     | Type   | Description                                                                                                           | Required |
|---------|--------|-----------------------------------------------------------------------------------------------------------------------|----------|
| route   | string | Specifies the method to query. A list of methods can be found under [routes](#routes).                               | Yes      |
| params  | object | Parameters can be passed here. Required parameters can be found under [routes](#routes).                             | Yes      |

**Example**
```js
import { TrackerAPI } from './src/index.mjs'
const st = new TrackerAPI({ 
  'apiKey': '{{your_api_key}}' 
})
await st.getData({
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

### .getRoutes()

This helper function displays all available routes. A list is also available under [routes](#routes).

**Method**
```js
.getRoutes()
```

**Example**
```js
import { TrackerAPI } from './src/index.mjs'
const st = new TrackerAPI({ 
  'apiKey': '{{your_api_key}}' 
})
console.log(st.getRoutes())
```

**Returns**
```js
Array of Strings
```

### .getSwapQuote()

This method retrieves a quote and all necessary data to perform a swap with `Solana Tracker`. The actual swap is triggered using `.postSwap()`.

**Method**
```js
async .getSwapQuote({ ...params })
```

| Key | Description | Required | 
| --- | --- | --- | 
| amount | The amount of the base token to swap. Can be a specific value, "auto" to use full wallet amount, or a percentage (e.g., "50%") to use that portion of the wallet balance | true |
| from | The base token address | true |
| payer | Public key of the wallet sending the transaction | true |
| slippage | Maximum acceptable slippage percentage | true |
| to | The quote token address | true |
| fee | Charge a custom fee to your users for each transaction (earn sol for each swap) | false |
| feeType | Fee application type | false |
| priorityFee | Amount in SOL to increase transaction processing priority | false |
| priorityFeeLevel | Required if priorityFee is set to auto | false |
| txVersion | Transaction version | false |


**Example**
```js
import { TrackerAPI } from './src/index.mjs'
const st = new TrackerAPI({ 
  'nodeUrl': '{{my_solana_node}}'  
})
const publicKey = '{{my_public_key}}'
const quote = await st.getSwapQuote({
  'from': 'So11111111111111111111111111111111111111112', // Solana Address
  'to': 'UEPp8H46WkPiBmi7nw35nyfFDNpxp9LWRPxSMHXpump',
  'amount': 0.0001,
  'slippage': 15,
  'payer': publicKey,
  'priorityFee': 0.0005,
  'feeType': 'add',
  'fee': `${publicKey}:0.0001`
})
```

**Returns**
```js
Object
```

### .postSwap()

This method triggers the actual swap after retrieving a quote with the `.getSwapQuote()` method.

**Method**
```js
async .postSwap({ quote, privateKey, skipConfirmation })
```

| Key            | Type   | Description                                                                                                                         | Required |
|----------------|--------|-------------------------------------------------------------------------------------------------------------------------------------|----------|
| quote          | object | Pass the response from the `.getSwapQuote` method here.                                                                             | Yes      |
| privateKey     | string | Provide the `privateKey`. This must match the `public key` provided in the `.getSwapQuote()` method.                                 | Yes      |
| skipConfirmation | boolean | Before executing the swap, the user is asked to confirm. Setting `skipConfirmation` to `true` disables this prompt.                 | No       |

**Example**
```js
import { TrackerAPI } from './src/index.mjs'
const st = new TrackerAPI({ 
  'nodeUrl': '{{my_solana_node}}'  
})
const publicKey = '{{my_public_key}}'
const quote = await st.getSwapQuote({
  'from': 'So11111111111111111111111111111111111111112', // Solana Address
  'to': 'UEPp8H46WkPiBmi7nw35nyfFDNpxp9LWRPxSMHXpump',
  'amount': 0.0001,
  'slippage': 15,
  'payer': publicKey,
  'priorityFee': 0.0005,
  'feeType': 'add',
  'fee': `${publicKey}:0.0001`
})
const swap = await st.postSwap({
  quote,
  'privateKey': '{{my_private_key}}',
  'skipConfirmation': false
})
console.log(swap['swap']['id'])
```

**Returns**
```js
Array of Strings
```

## Routes

This overview provides a list of all available methods and their descriptions.

| Key | Route | Description | Example | Response |
| --- | --- | --- |--- |--- |
| chartData | GET /chart/{token} |  | [X](./EXAMPLES.md?#chartData) | [X](./examples/chartData.json) |
| chartDataByPool | GET /chart/{token}/{pool} | Get OLCVH (Open, Low, Close, Volume, High) data for charts. | [X](./EXAMPLES.md?#chartDataByPool) | [X](./examples/chartDataByPool.json) |
| firstBuyersOfToken | GET /first-buyers/{token} | Retrieve the first 100 buyers of a token (since API started recording data) with Profit and Loss data for each wallet. | [X](./EXAMPLES.md?#firstBuyersOfToken) | [X](./examples/firstBuyersOfToken.json) |
| graduatedTokens | GET /tokens/multi/graduated | Overview of all graduated pumpfun/moonshot tokens (Pumpvision / Photon Memescope style). | [X](./EXAMPLES.md?#graduatedTokens) | [X](./examples/graduatedTokens.json) |
| latestTokens | GET /tokens/latest | Retrieve the latest 100 tokens. | [X](./EXAMPLES.md?#latestTokens) | [X](./examples/latestTokens.json) |
| multiPriceInformation | GET /price/multi | Get price information for multiple tokens (up to 100). | [X](./EXAMPLES.md?#multiPriceInformation) | [X](./examples/multiPriceInformation.json) |
| multiTokenInformation | GET /tokens/multi/all | Get an overview of latest, graduating, and graduated tokens (Pumpvision / Photon Memescope style). | [X](./EXAMPLES.md?#multiTokenInformation) | [X](./examples/multiTokenInformation.json) |
| paginatedTopTraders | GET /top-traders/all/{page} | Get the most profitable traders across all tokens, with optional pagination. | [X](./EXAMPLES.md?#paginatedTopTraders) | [X](./examples/paginatedTopTraders.json) |
| pnlForSpecificToken | GET /pnl/{wallet}/{token} | Get Profit and Loss data for a specific token in a wallet. | [X](./EXAMPLES.md?#pnlForSpecificToken) | [X](./examples/pnlForSpecificToken.json) |
| postMultiPrice | POST /price/multi | Similar to GET /price/multi, but accepts an array of token addresses in the request body. | [X](./EXAMPLES.md?#postMultiPrice) | [X](./examples/postMultiPrice.json) |
| postPrice | POST /price | Similar to GET /price, but accepts token address in the request body. | [X](./EXAMPLES.md?#postPrice) | [X](./examples/postPrice.json) |
| priceHistory | GET /price/history | Get historic price information for a single token. | [X](./EXAMPLES.md?#priceHistory) | [X](./examples/priceHistory.json) |
| priceInformation | GET /price | Get price information for a single token. | [X](./EXAMPLES.md?#priceInformation) | [X](./examples/priceInformation.json) |
| profitAndLossData | GET /pnl/{wallet} | Get Profit and Loss data for all positions of a wallet. | [X](./EXAMPLES.md?#profitAndLossData) | [X](./examples/profitAndLossData.json) |
| search | GET /search | The /search endpoint provides a flexible search interface for pools and tokens with support for multiple filtering criteria and pagination. | [X](./EXAMPLES.md?#search) | [X](./examples/search.json) |
| tokenAth | GET /tokens/{tokenAddress}/ath | Retrieve the all time high price of a token (since data api started recording) | [X](./EXAMPLES.md?#tokenAth) | [X](./examples/tokenAth.json) |
| tokenHolders | GET /tokens/{tokenAddress}/holders | Get the top 100 holders for a specific token. | [X](./EXAMPLES.md?#tokenHolders) | [X](./examples/tokenHolders.json) |
| tokenInformation | GET /tokens/{tokenAddress} | Retrieve all information for a specific token. | [X](./EXAMPLES.md?#tokenInformation) | [X](./examples/tokenInformation.json) |
| tokenStats | GET /stats/{token} | Get detailed stats for a token over various time intervals. | [X](./EXAMPLES.md?#tokenStats) | [X](./examples/tokenStats.json) |
| tokenStatsByPool | GET /stats/{token}/{pool} | Get detailed stats for a token-pool pair over various time intervals. | [X](./EXAMPLES.md?#tokenStatsByPool) | [X](./examples/tokenStatsByPool.json) |
| tokenTrades | GET /trades/{tokenAddress} | Get the latest trades for a token across all pools. | [X](./EXAMPLES.md?#tokenTrades) | [X](./examples/tokenTrades.json) |
| tokenTradesByPool | GET /trades/{tokenAddress}/{poolAddress} | Get the latest trades for a specific token and pool pair. | [X](./EXAMPLES.md?#tokenTradesByPool) | [X](./examples/tokenTradesByPool.json) |
| tokenTradesByPoolAndOwner | GET /trades/{tokenAddress}/{poolAddress}/{owner} | Get the latest trades for a specific token, pool, and wallet address. | [X](./EXAMPLES.md?#tokenTradesByPoolAndOwner) | [X](./examples/tokenTradesByPoolAndOwner.json) |
| tokenVolume | GET /tokens/volume | Retrieve the top 100 tokens sorted by highest volume. | [X](./EXAMPLES.md?#tokenVolume) | [X](./examples/tokenVolume.json) |
| topTraders | GET /top-traders/all | Get the most profitable traders | [X](./EXAMPLES.md?#topTraders) | [X](./examples/topTraders.json) |
| topTradersForToken | GET /top-traders/{token} | Get top 100 traders by PnL for a token. | [X](./EXAMPLES.md?#topTradersForToken) | [X](./examples/topTradersForToken.json) |
| tradesByWallet | GET /trades/{tokenAddress}/by-wallet/{owner} | Get the latest trades for a specific token and wallet address. | [X](./EXAMPLES.md?#tradesByWallet) | [X](./examples/tradesByWallet.json) |
| trendingTokens | GET /tokens/trending | Get the top 100 trending tokens based on transaction volume in the past hour. | [X](./EXAMPLES.md?#trendingTokens) | [X](./examples/trendingTokens.json) |
| trendingTokensByTimeframe | GET /tokens/trending/{timeframe} | Returns trending tokens for a specific time interval. | [X](./EXAMPLES.md?#trendingTokensByTimeframe) | [X](./examples/trendingTokensByTimeframe.json) |
| walletInformation | GET /wallet/{owner} | Get all tokens in a wallet with current value in USD. | [X](./EXAMPLES.md?#walletInformation) | [X](./examples/walletInformation.json) |
| walletTrades | GET /wallet/{owner}/trades | Get the latest trades of a wallet. | [X](./EXAMPLES.md?#walletTrades) | [X](./examples/walletTrades.json) |


## License

This project is licensed under the MIT License. Details can be found in the [LICENSE](LICENSE) file.