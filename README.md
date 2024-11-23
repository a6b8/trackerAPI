[![CircleCI](https://img.shields.io/circleci/build/github/a6b8/SolanaTracker/main)]() ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

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


**Examples**

The following examples demonstrate the usage of the methods.

#### chartData




```js
await st.request( {
    "route": "chartData",
    "params": {
        "token": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| token | Yes | string | Token address |


#### chartDataByPool

Get OLCVH (Open, Low, Close, Volume, High) data for charts.


```js
await st.request( {
    "route": "chartDataByPool",
    "params": {
        "token": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
        "pool": "9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| token | Yes | string | Token address |
| pool | Yes | string | Pool identifier |
| type | No | string | Time interval (e.g., “1s”, “1m”, “1h”, “1d”) |
| time_from | No | integer | Start time (Unix timestamp in seconds) |
| time_to | No | integer | End time (Unix timestamp in seconds) |
| marketCap | No | integer | Return chart for market cap instead of pricing |


#### firstBuyersOfToken

Retrieve the first 100 buyers of a token (since API started recording data) with Profit and Loss data for each wallet.


```js
await st.request( {
    "route": "firstBuyersOfToken",
    "params": {
        "token": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| token | Yes | string | Token address |


#### graduatedTokens

Overview of all graduated pumpfun/moonshot tokens (Pumpvision / Photon Memescope style).


```js
await st.request( {
    "route": "graduatedTokens",
    "params": {}
} )
```



#### latestTokens

Retrieve the latest 100 tokens.


```js
await st.request( {
    "route": "latestTokens",
    "params": {}
} )
```



#### multiPriceInformation

Get price information for multiple tokens (up to 100).


```js
await st.request( {
    "route": "multiPriceInformation",
    "params": {
        "tokens": [
            "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
        ]
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| tokens | Yes | array | Token addresses |
| priceChanges | No | boolean | Include price change data in response |


#### multiTokenInformation

Get an overview of latest, graduating, and graduated tokens (Pumpvision / Photon Memescope style).


```js
await st.request( {
    "route": "multiTokenInformation",
    "params": {}
} )
```



#### paginatedTopTraders

Get the most profitable traders across all tokens, with optional pagination.


```js
await st.request( {
    "route": "paginatedTopTraders",
    "params": {
        "page": 1
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| page | Yes | integer | Page number for pagination (starts with 1) |
| expandPnl | No |  | Include detailed PnL data for each token if true |
| sortBy | No | string | Sort results by metric (“total” or “winPercentage”) |


#### pnlForSpecificToken

Get Profit and Loss data for a specific token in a wallet.


```js
await st.request( {
    "route": "pnlForSpecificToken",
    "params": {
        "token": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
        "wallet": "8bHMVvpApEQS6M2qRv4eJUDptoW919NFrBSbeDGmoGJ6"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| wallet | Yes | string | Wallet address |
| token | Yes | string | Token address |


#### postMultiPrice

Similar to GET /price/multi, but accepts an array of token addresses in the request body.


```js
await st.request( {
    "route": "postMultiPrice",
    "params": {
        "tokens": [
            "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
        ]
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| tokens | Yes | array | Token addresses |
| priceChanges | No | boolean | Include price change data in response |


#### postPrice

Similar to GET /price, but accepts token address in the request body.


```js
await st.request( {
    "route": "postPrice",
    "params": {
        "token": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| token | Yes | string | Token address |


#### priceHistory

Get historic price information for a single token.


```js
await st.request( {
    "route": "priceHistory",
    "params": {
        "token": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| token | Yes | string | Token address |


#### priceInformation

Get price information for a single token.


```js
await st.request( {
    "route": "priceInformation",
    "params": {
        "token": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| token | Yes | string | Token address |
| priceChanges | No | boolean | Include price change data in response |


#### profitAndLossData

Get Profit and Loss data for all positions of a wallet.


```js
await st.request( {
    "route": "profitAndLossData",
    "params": {
        "wallet": "8bHMVvpApEQS6M2qRv4eJUDptoW919NFrBSbeDGmoGJ6"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| wallet | Yes | string | Wallet address |
| showHistoricPnL | No | boolean | Adds PnL data for 1d, 7d and 30d intervals (BETA) |


#### search

The /search endpoint provides a flexible search interface for pools and tokens with support for multiple filtering criteria and pagination.


```js
await st.request( {
    "route": "search",
    "params": {
        "query": "soybean",
        "market": "pumpfun"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| query | Yes | string | Search term for token symbol, name, or address |
| page | No | integer | Page number for pagination (starts with 1) |
| limit | No | integer | Number of results per page |
| minLiquidity | No | integer | Minimum liquidity in USD |
| maxLiquidity | No | integer | Maximum liquidity in USD |
| minMarketCap | No | integer | Minimum market cap in USD |
| maxMarketCap | No | integer | Maximum market cap in USD |
| minBuys | No | integer | Minimum number of buy transactions |
| maxBuys | No | integer | Maximum number of buy transactions |
| minSells | No | integer | Minimum number of sell transactions |
| maxSells | No | integer | Maximum number of sell transactions |
| minTotalTransactions | No | integer | Minimum total number of transactions |
| maxTotalTransactions | No | integer | Maximum total number of transactions |
| lpBurn | No | integer | LP token burn percentage |
| market | No | string | Market identifier |
| freezeAuthority | No | string | Freeze authority address |
| mintAuthority | No | integer | Mint authority address |
| deployer | No | string | Deployer address |
| showPriceChanges | No | boolean | Include price change data in response |


#### tokenAth

Retrieve the all time high price of a token (since data api started recording)


```js
await st.request( {
    "route": "tokenAth",
    "params": {
        "tokenAddress": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| tokenAddress | Yes | string | Token address |


#### tokenHolders

Get the top 100 holders for a specific token.


```js
await st.request( {
    "route": "tokenHolders",
    "params": {
        "tokenAddress": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| tokenAddress | Yes | string | Token address |


#### tokenInformation

Retrieve all information for a specific token.


```js
await st.request( {
    "route": "tokenInformation",
    "params": {
        "tokenAddress": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| tokenAddress | Yes | string | Token address |


#### tokenStats

Get detailed stats for a token over various time intervals.


```js
await st.request( {
    "route": "tokenStats",
    "params": {
        "token": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| token | Yes | string | Token address |


#### tokenStatsByPool

Get detailed stats for a token-pool pair over various time intervals.


```js
await st.request( {
    "route": "tokenStatsByPool",
    "params": {
        "token": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
        "pool": "9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| token | Yes | string | Token address |
| pool | Yes | string | Pool identifier |


#### tokenTrades

Get the latest trades for a token across all pools.


```js
await st.request( {
    "route": "tokenTrades",
    "params": {
        "tokenAddress": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| tokenAddress | Yes | string | Token address |


#### tokenTradesByPool

Get the latest trades for a specific token and pool pair.


```js
await st.request( {
    "route": "tokenTradesByPool",
    "params": {
        "tokenAddress": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
        "poolAddress": "9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| tokenAddress | Yes | string | Token address |
| poolAddress | Yes | string | Pool address |


#### tokenTradesByPoolAndOwner

Get the latest trades for a specific token, pool, and wallet address.


```js
await st.request( {
    "route": "tokenTradesByPoolAndOwner",
    "params": {
        "tokenAddress": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
        "poolAddress": "9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW",
        "owner": "8bHMVvpApEQS6M2qRv4eJUDptoW919NFrBSbeDGmoGJ6"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| tokenAddress | Yes | string | Token address |
| poolAddress | Yes | string | Pool address |
| owner | Yes | string | Owner address |


#### tokenVolume

Retrieve the top 100 tokens sorted by highest volume.


```js
await st.request( {
    "route": "tokenVolume",
    "params": {}
} )
```



#### topTraders

Get the most profitable traders


```js
await st.request( {
    "route": "topTraders",
    "params": {}
} )
```



#### topTradersForToken

Get top 100 traders by PnL for a token.


```js
await st.request( {
    "route": "topTradersForToken",
    "params": {
        "token": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| token | Yes | string | Token address |


#### tradesByWallet

Get the latest trades for a specific token and wallet address.


```js
await st.request( {
    "route": "tradesByWallet",
    "params": {
        "tokenAddress": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
        "owner": "8bHMVvpApEQS6M2qRv4eJUDptoW919NFrBSbeDGmoGJ6"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| tokenAddress | Yes | string | Token address |
| owner | Yes | string | Owner address |
| cursor | No | string | Cursor for pagination |
| showMeta | No | boolean | Set to ‘true’ to add metadata for from and to tokens |
| parseJupiter | No | boolean | Set to ‘true’ to combine all transfers within a Jupiter swap into a single transaction. By default, each transfer is shown separately. |
| hideArb | No | boolean | Set to ‘true’ to hide arbitrage or other transactions that don’t have both the ‘from’ and ‘to’ token addresses matching the token parameter |


#### trendingTokens

Get the top 100 trending tokens based on transaction volume in the past hour.


```js
await st.request( {
    "route": "trendingTokens",
    "params": {}
} )
```



#### trendingTokensByTimeframe

Returns trending tokens for a specific time interval.


```js
await st.request( {
    "route": "trendingTokensByTimeframe",
    "params": {
        "timeframe": "1h"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| timeframe | Yes | string | Timeframe for data aggregation |


#### walletInformation

Get all tokens in a wallet with current value in USD.


```js
await st.request( {
    "route": "walletInformation",
    "params": {
        "owner": "95z7osZ7LcAoFkhf1ka3hWdWU8Fk8Fap69ymeeaaMruV"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| owner | Yes | string | Owner address |


#### walletTrades

Get the latest trades of a wallet.


```js
await st.request( {
    "route": "walletTrades",
    "params": {
        "owner": "95z7osZ7LcAoFkhf1ka3hWdWU8Fk8Fap69ymeeaaMruV"
    }
} )
```

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| owner | Yes | string | Owner address |
| cursor | No | string | Cursor for pagination |




## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.