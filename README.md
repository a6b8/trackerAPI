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

| Route | Description | Example | Response |
| --- | --- |--- |--- |
| chartData |  | [X](./EXAMPLES.md?#chartData) | [X](./examples/chartData.json) |
| chartDataByPool | Get OLCVH (Open, Low, Close, Volume, High) data for charts. | [X](./EXAMPLES.md?#chartDataByPool) | [X](./examples/chartDataByPool.json) |
| firstBuyersOfToken | Retrieve the first 100 buyers of a token (since API started recording data) with Profit and Loss data for each wallet. | [X](./EXAMPLES.md?#firstBuyersOfToken) | [X](./examples/firstBuyersOfToken.json) |
| graduatedTokens | Overview of all graduated pumpfun/moonshot tokens (Pumpvision / Photon Memescope style). | [X](./EXAMPLES.md?#graduatedTokens) | [X](./examples/graduatedTokens.json) |
| latestTokens | Retrieve the latest 100 tokens. | [X](./EXAMPLES.md?#latestTokens) | [X](./examples/latestTokens.json) |
| multiPriceInformation | Get price information for multiple tokens (up to 100). | [X](./EXAMPLES.md?#multiPriceInformation) | [X](./examples/multiPriceInformation.json) |
| multiTokenInformation | Get an overview of latest, graduating, and graduated tokens (Pumpvision / Photon Memescope style). | [X](./EXAMPLES.md?#multiTokenInformation) | [X](./examples/multiTokenInformation.json) |
| paginatedTopTraders | Get the most profitable traders across all tokens, with optional pagination. | [X](./EXAMPLES.md?#paginatedTopTraders) | [X](./examples/paginatedTopTraders.json) |
| pnlForSpecificToken | Get Profit and Loss data for a specific token in a wallet. | [X](./EXAMPLES.md?#pnlForSpecificToken) | [X](./examples/pnlForSpecificToken.json) |
| postMultiPrice | Similar to GET /price/multi, but accepts an array of token addresses in the request body. | [X](./EXAMPLES.md?#postMultiPrice) | [X](./examples/postMultiPrice.json) |
| postPrice | Similar to GET /price, but accepts token address in the request body. | [X](./EXAMPLES.md?#postPrice) | [X](./examples/postPrice.json) |
| priceHistory | Get historic price information for a single token. | [X](./EXAMPLES.md?#priceHistory) | [X](./examples/priceHistory.json) |
| priceInformation | Get price information for a single token. | [X](./EXAMPLES.md?#priceInformation) | [X](./examples/priceInformation.json) |
| profitAndLossData | Get Profit and Loss data for all positions of a wallet. | [X](./EXAMPLES.md?#profitAndLossData) | [X](./examples/profitAndLossData.json) |
| search | The /search endpoint provides a flexible search interface for pools and tokens with support for multiple filtering criteria and pagination. | [X](./EXAMPLES.md?#search) | [X](./examples/search.json) |
| tokenAth | Retrieve the all time high price of a token (since data api started recording) | [X](./EXAMPLES.md?#tokenAth) | [X](./examples/tokenAth.json) |
| tokenHolders | Get the top 100 holders for a specific token. | [X](./EXAMPLES.md?#tokenHolders) | [X](./examples/tokenHolders.json) |
| tokenInformation | Retrieve all information for a specific token. | [X](./EXAMPLES.md?#tokenInformation) | [X](./examples/tokenInformation.json) |
| tokenStats | Get detailed stats for a token over various time intervals. | [X](./EXAMPLES.md?#tokenStats) | [X](./examples/tokenStats.json) |
| tokenStatsByPool | Get detailed stats for a token-pool pair over various time intervals. | [X](./EXAMPLES.md?#tokenStatsByPool) | [X](./examples/tokenStatsByPool.json) |
| tokenTrades | Get the latest trades for a token across all pools. | [X](./EXAMPLES.md?#tokenTrades) | [X](./examples/tokenTrades.json) |
| tokenTradesByPool | Get the latest trades for a specific token and pool pair. | [X](./EXAMPLES.md?#tokenTradesByPool) | [X](./examples/tokenTradesByPool.json) |
| tokenTradesByPoolAndOwner | Get the latest trades for a specific token, pool, and wallet address. | [X](./EXAMPLES.md?#tokenTradesByPoolAndOwner) | [X](./examples/tokenTradesByPoolAndOwner.json) |
| tokenVolume | Retrieve the top 100 tokens sorted by highest volume. | [X](./EXAMPLES.md?#tokenVolume) | [X](./examples/tokenVolume.json) |
| topTraders | Get the most profitable traders | [X](./EXAMPLES.md?#topTraders) | [X](./examples/topTraders.json) |
| topTradersForToken | Get top 100 traders by PnL for a token. | [X](./EXAMPLES.md?#topTradersForToken) | [X](./examples/topTradersForToken.json) |
| tradesByWallet | Get the latest trades for a specific token and wallet address. | [X](./EXAMPLES.md?#tradesByWallet) | [X](./examples/tradesByWallet.json) |
| trendingTokens | Get the top 100 trending tokens based on transaction volume in the past hour. | [X](./EXAMPLES.md?#trendingTokens) | [X](./examples/trendingTokens.json) |
| trendingTokensByTimeframe | Returns trending tokens for a specific time interval. | [X](./EXAMPLES.md?#trendingTokensByTimeframe) | [X](./examples/trendingTokensByTimeframe.json) |
| walletInformation | Get all tokens in a wallet with current value in USD. | [X](./EXAMPLES.md?#walletInformation) | [X](./examples/walletInformation.json) |
| walletTrades | Get the latest trades of a wallet. | [X](./EXAMPLES.md?#walletTrades) | [X](./examples/walletTrades.json) |


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## Disclaimer
This project is provided "as is" without any warranties or guarantees. While every effort has been made to ensure the accuracy and reliability of the information and functionality within this project, the authors and contributors are not responsible for any errors, lost, omissions, or damages arising from its use. Users are advised to thoroughly test and validate the code and functionality in their own environment before deploying it to production. By using this project, you agree to take full responsibility for any outcomes or risks associated with its use.