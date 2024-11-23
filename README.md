[![CircleCI](https://img.shields.io/circleci/build/github/a6b8/solanaTracker/main)]() ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# Solana Tracker API

This module enables efficient and easy usage of the `SolanaTracker API`.

## Features

The following features are available:
- Validation of input.
- Standardization of parameters for the user.

## Quickstart

```js
import { SolanaTracker, examples } from '../src/index.mjs'

const apiKey = `{{your_api_key}}`
const st = new SolanaTracker({ apiKey })
const { route, params } = examples[0]
const response = await st.request({ route, params })
console.log(response)
```

## Table of Contents
- [Solana Tracker API](#solana-tracker-api)
  - [Features](#features)
  - [Quickstart](#quickstart)
  - [Table of Contents](#table-of-contents)
  - [Methods](#methods)
    - [constructor()](#constructor)
    - [request()](#request)
    - [setApiKey()](#setapikey)
    - [getMethods()](#getmethods)
  - [Routes](#routes)
  - [License](#license)
  - [Disclaimer](#disclaimer)

## Methods

### constructor()

This method initializes the class.

**Method**
```js
.constructor({ apiKey })
```

| Key     | Type   | Description                                  | Required |
|---------|--------|----------------------------------------------|----------|
| apiKey  | string | Sets the `apiKey` for the SolanaTracker API. | Yes      |

**Example**
```js
import { SolanaTracker } from './src/index.mjs'

const apiKey = `{{your_api_key}}`
const st = new SolanaTracker({ apiKey })
```

**Returns**
```js
true
```

### request()

This method creates, sends, and evaluates requests to the SolanaTracker API.

**Method**
```js
.request({ route, params })
```

| Key     | Type   | Description                                                                                                                            | Required |
|---------|--------|----------------------------------------------------------------------------------------------------------------------------------------|----------|
| route   | string | Specifies the method to be called. A list of available methods can be found under [routes](#routes).                                   | Yes      |
| params  | object | Parameters to be passed for the request. Required parameters can be found under [routes](#routes).                                     | Yes      |

**Example**
```js
import { SolanaTracker } from './src/index.mjs'

const apiKey = `{{your_api_key}}`
const st = new SolanaTracker({ apiKey })
st.request({
    route: 'search',
    params: {
        query: 'GOAT'
    }
})
```

**Returns**
```js
true
```

### setApiKey()

This helper method allows you to change the `apiKey` during runtime.

**Method**
```js
.setApiKey({ apiKey })
```

| Key     | Type   | Description                                  | Required |
|---------|--------|----------------------------------------------|----------|
| apiKey  | string | Sets the `apiKey` for the SolanaTracker API. | Yes      |

**Example**
```js
import { SolanaTracker } from './src/index.mjs'

let apiKey = `{{your_api_key}}`
const st = new SolanaTracker({ apiKey })

let newApiKey = `{{new_your_api_key}}`
st.setApiKey({ apiKey: newApiKey })
```

**Returns**
```js
true
```

### getMethods()

This helper method outputs all available endpoints (methods).

**Method**
```js
.getMethods()
```

**Example**
```js
import { SolanaTracker } from './src/index.mjs'

let apiKey = `{{your_api_key}}`
const st = new SolanaTracker({ apiKey })
console.log(st.getMethods())
```

**Returns**
```js
Array of Strings
```

## Routes
This overview provides a list of all available methods and their descriptions.

| Route | Example | Response | Description |
| --- | --- |--- |--- |
| chartData | [X](./EXAMPLES.md?#chartData) | [X](./examples/chartData.json) | |
| chartDataByPool | [X](./EXAMPLES.md?#chartDataByPool) | [X](./examples/chartDataByPool.json) |Get OLCVH (Open, Low, Close, Volume, High) data for charts. |
| firstBuyersOfToken | [X](./EXAMPLES.md?#firstBuyersOfToken) | [X](./examples/firstBuyersOfToken.json) |Retrieve the first 100 buyers of a token (since API started recording data) with Profit and Loss data for each wallet. |
| graduatedTokens | [X](./EXAMPLES.md?#graduatedTokens) | [X](./examples/graduatedTokens.json) |Overview of all graduated pumpfun/moonshot tokens (Pumpvision / Photon Memescope style). |
| latestTokens | [X](./EXAMPLES.md?#latestTokens) | [X](./examples/latestTokens.json) |Retrieve the latest 100 tokens. |
| multiPriceInformation | [X](./EXAMPLES.md?#multiPriceInformation) | [X](./examples/multiPriceInformation.json) |Get price information for multiple tokens (up to 100). |
| multiTokenInformation | [X](./EXAMPLES.md?#multiTokenInformation) | [X](./examples/multiTokenInformation.json) |Get an overview of latest, graduating, and graduated tokens (Pumpvision / Photon Memescope style). |
| paginatedTopTraders | [X](./EXAMPLES.md?#paginatedTopTraders) | [X](./examples/paginatedTopTraders.json) |Get the most profitable traders across all tokens, with optional pagination. |
| pnlForSpecificToken | [X](./EXAMPLES.md?#pnlForSpecificToken) | [X](./examples/pnlForSpecificToken.json) |Get Profit and Loss data for a specific token in a wallet. |
| postMultiPrice | [X](./EXAMPLES.md?#postMultiPrice) | [X](./examples/postMultiPrice.json) |Similar to GET /price/multi, but accepts an array of token addresses in the request body. |
| postPrice | [X](./EXAMPLES.md?#postPrice) | [X](./examples/postPrice.json) |Similar to GET /price, but accepts token address in the request body. |
| priceHistory | [X](./EXAMPLES.md?#priceHistory) | [X](./examples/priceHistory.json) |Get historic price information for a single token. |
| priceInformation | [X](./EXAMPLES.md?#priceInformation) | [X](./examples/priceInformation.json) |Get price information for a single token. |
| profitAndLossData | [X](./EXAMPLES.md?#profitAndLossData) | [X](./examples/profitAndLossData.json) |Get Profit and Loss data for all positions of a wallet. |
| search | [X](./EXAMPLES.md?#search) | [X](./examples/search.json) |The /search endpoint provides a flexible search interface for pools and tokens with support for multiple filtering criteria and pagination. |
| tokenAth | [X](./EXAMPLES.md?#tokenAth) | [X](./examples/tokenAth.json) |Retrieve the all time high price of a token (since data api started recording) |
| tokenHolders | [X](./EXAMPLES.md?#tokenHolders) | [X](./examples/tokenHolders.json) |Get the top 100 holders for a specific token. |
| tokenInformation | [X](./EXAMPLES.md?#tokenInformation) | [X](./examples/tokenInformation.json) |Retrieve all information for a specific token. |
| tokenStats | [X](./EXAMPLES.md?#tokenStats) | [X](./examples/tokenStats.json) |Get detailed stats for a token over various time intervals. |
| tokenStatsByPool | [X](./EXAMPLES.md?#tokenStatsByPool) | [X](./examples/tokenStatsByPool.json) |Get detailed stats for a token-pool pair over various time intervals. |
| tokenTrades | [X](./EXAMPLES.md?#tokenTrades) | [X](./examples/tokenTrades.json) |Get the latest trades for a token across all pools. |
| tokenTradesByPool | [X](./EXAMPLES.md?#tokenTradesByPool) | [X](./examples/tokenTradesByPool.json) |Get the latest trades for a specific token and pool pair. |
| tokenTradesByPoolAndOwner | [X](./EXAMPLES.md?#tokenTradesByPoolAndOwner) | [X](./examples/tokenTradesByPoolAndOwner.json) |Get the latest trades for a specific token, pool, and wallet address. |
| tokenVolume | [X](./EXAMPLES.md?#tokenVolume) | [X](./examples/tokenVolume.json) |Retrieve the top 100 tokens sorted by highest volume. |
| topTraders | [X](./EXAMPLES.md?#topTraders) | [X](./examples/topTraders.json) |Get the most profitable traders |
| topTradersForToken | [X](./EXAMPLES.md?#topTradersForToken) | [X](./examples/topTradersForToken.json) |Get top 100 traders by PnL for a token. |
| tradesByWallet | [X](./EXAMPLES.md?#tradesByWallet) | [X](./examples/tradesByWallet.json) |Get the latest trades for a specific token and wallet address. |
| trendingTokens | [X](./EXAMPLES.md?#trendingTokens) | [X](./examples/trendingTokens.json) |Get the top 100 trending tokens based on transaction volume in the past hour. |
| trendingTokensByTimeframe | [X](./EXAMPLES.md?#trendingTokensByTimeframe) | [X](./examples/trendingTokensByTimeframe.json) |Returns trending tokens for a specific time interval. |
| walletInformation | [X](./EXAMPLES.md?#walletInformation) | [X](./examples/walletInformation.json) |Get all tokens in a wallet with current value in USD. |
| walletTrades | [X](./EXAMPLES.md?#walletTrades) | [X](./examples/walletTrades.json) |Get the latest trades of a wallet. |


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## Disclaimer
This project is provided "as is" without any warranties or guarantees. While every effort has been made to ensure the accuracy and reliability of the information and functionality within this project, the authors and contributors are not responsible for any errors, lost, omissions, or damages arising from its use. Users are advised to thoroughly test and validate the code and functionality in their own environment before deploying it to production. By using this project, you agree to take full responsibility for any outcomes or risks associated with its use.