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

| Route | Description |
| --- | --- |
| [chartData](#chartData) |  |
| [chartDataByPool](#chartDataByPool) | Get OLCVH (Open, Low, Close, Volume, High) data for charts. |
| [firstBuyersOfToken](#firstBuyersOfToken) | Retrieve the first 100 buyers of a token (since API started recording data) with Profit and Loss data for each wallet. |
| [graduatedTokens](#graduatedTokens) | Overview of all graduated pumpfun/moonshot tokens (Pumpvision / Photon Memescope style). |
| [latestTokens](#latestTokens) | Retrieve the latest 100 tokens. |
| [multiPriceInformation](#multiPriceInformation) | Get price information for multiple tokens (up to 100). |
| [multiTokenInformation](#multiTokenInformation) | Get an overview of latest, graduating, and graduated tokens (Pumpvision / Photon Memescope style). |
| [paginatedTopTraders](#paginatedTopTraders) | Get the most profitable traders across all tokens, with optional pagination. |
| [pnlForSpecificToken](#pnlForSpecificToken) | Get Profit and Loss data for a specific token in a wallet. |
| [postMultiPrice](#postMultiPrice) | Similar to GET /price/multi, but accepts an array of token addresses in the request body. |
| [postPrice](#postPrice) | Similar to GET /price, but accepts token address in the request body. |
| [priceHistory](#priceHistory) | Get historic price information for a single token. |
| [priceInformation](#priceInformation) | Get price information for a single token. |
| [profitAndLossData](#profitAndLossData) | Get Profit and Loss data for all positions of a wallet. |
| [search](#search) | The /search endpoint provides a flexible search interface for pools and tokens with support for multiple filtering criteria and pagination. |
| [tokenAth](#tokenAth) | Retrieve the all time high price of a token (since data api started recording) |
| [tokenHolders](#tokenHolders) | Get the top 100 holders for a specific token. |
| [tokenInformation](#tokenInformation) | Retrieve all information for a specific token. |
| [tokenStats](#tokenStats) | Get detailed stats for a token over various time intervals. |
| [tokenStatsByPool](#tokenStatsByPool) | Get detailed stats for a token-pool pair over various time intervals. |
| [tokenTrades](#tokenTrades) | Get the latest trades for a token across all pools. |
| [tokenTradesByPool](#tokenTradesByPool) | Get the latest trades for a specific token and pool pair. |
| [tokenTradesByPoolAndOwner](#tokenTradesByPoolAndOwner) | Get the latest trades for a specific token, pool, and wallet address. |
| [tokenVolume](#tokenVolume) | Retrieve the top 100 tokens sorted by highest volume. |
| [topTraders](#topTraders) | Get the most profitable traders |
| [topTradersForToken](#topTradersForToken) | Get top 100 traders by PnL for a token. |
| [tradesByWallet](#tradesByWallet) | Get the latest trades for a specific token and wallet address. |
| [trendingTokens](#trendingTokens) | Get the top 100 trending tokens based on transaction volume in the past hour. |
| [trendingTokensByTimeframe](#trendingTokensByTimeframe) | Returns trending tokens for a specific time interval. |
| [walletInformation](#walletInformation) | Get all tokens in a wallet with current value in USD. |
| [walletTrades](#walletTrades) | Get the latest trades of a wallet. |


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## Disclaimer
This project is provided "as is" without any warranties or guarantees. While every effort has been made to ensure the accuracy and reliability of the information and functionality within this project, the authors and contributors are not responsible for any errors, lost, omissions, or damages arising from its use. Users are advised to thoroughly test and validate the code and functionality in their own environment before deploying it to production. By using this project, you agree to take full responsibility for any outcomes or risks associated with its use.