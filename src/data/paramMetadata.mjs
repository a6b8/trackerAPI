const paramMetadata = {
    'cursor': { 
        'description': 'Cursor for pagination',
        'type': 'string'
    },
    'deployer': { 
        'description': 'Deployer address',
        'type': 'string'
    },
    'expandPnl': { 
        'description': 'Include detailed PnL data for each token if true',
        'type': ''
    },
    'freezeAuthority': { 
        'description': 'Freeze authority address',
        'type': 'string'
    },
    'hideArb': { 
        'description': "Set to ‘true’ to hide arbitrage or other transactions that don’t have both the ‘from’ and ‘to’ token addresses matching the token parameter",
        'type': 'boolean'
    },
    'limit': { 
        'description': 'Number of results per page',
        'type': 'integer'
    },
    'lpBurn': { 
        'description': 'LP token burn percentage',
        'type': 'integer'
    },
    'market': { 
        'description': 'Market identifier',
        'type': 'string'
    },
    'marketCap': { 
        'description': 'Return chart for market cap instead of pricing',
        'type': 'integer'
    },
    'maxBuys': { 
        'description': 'Maximum number of buy transactions',
        'type': 'integer'
    },
    'maxLiquidity': { 
        'description': 'Maximum liquidity in USD',
        'type': 'integer'
    },
    'maxMarketCap': { 
        'description': 'Maximum market cap in USD',
        'type': 'integer'
    },
    'maxSells': { 
        'description': 'Maximum number of sell transactions',
        'type': 'integer'
    },
    'maxTotalTransactions': { 
        'description': 'Maximum total number of transactions',
        'type': 'integer'
    },
    'minBuys': { 
        'description': 'Minimum number of buy transactions',
        'type': 'integer'
    },
    'minLiquidity': { 
        'description': 'Minimum liquidity in USD',
        'type': 'integer'
    },
    'minMarketCap': { 
        'description': 'Minimum market cap in USD',
        'type': 'integer'
    },
    'minSells': { 
        'description': 'Minimum number of sell transactions',
        'type': 'integer'
    },
    'minTotalTransactions': { 
        'description': 'Minimum total number of transactions',
        'type': 'integer'
    },
    'mintAuthority': { 
        'description': 'Mint authority address',
        'type': 'integer'
    },
    'owner': { 
        'description': 'Owner address',
        'type': 'string'
    },
    'page': { 
        'description': 'Page number for pagination (starts with 1)',
        'type': 'integer'
    },
    'parseJupiter': { 
        'description': 'Set to ‘true’ to combine all transfers within a Jupiter swap into a single transaction. By default, each transfer is shown separately.',
        'type': 'boolean'
    },
    'pool': { 
        'description': 'Pool identifier',
        'type': 'string'
    },
    'poolAddress': { 
        'description': 'Pool address',
        'type': 'string'
    },
    'priceChanges': { 
        'description': 'Include price change data in response',
        'type': 'boolean'
    },
    'query': { 
        'description': 'Search term for token symbol, name, or address',
        'type': 'string'
    },
    'showHistoricPnL': { 
        'description': 'Adds PnL data for 1d, 7d and 30d intervals (BETA)',
        'type': 'boolean'
    },
    'showMeta': { 
        'description': 'Set to ‘true’ to add metadata for from and to tokens',
        'type': 'boolean'
    },
    'showPriceChanges': { 
        'description': 'Include price change data in response',
        'type': 'boolean'
    },
    'sortBy': { 
        'description': 'Sort results by metric (“total” or “winPercentage”)',
        'type': 'string'
    },
    'time_from': { 
        'description': 'Start time (Unix timestamp in seconds)',
        'type': 'integer'
    },
    'time_to': { 
        'description': 'End time (Unix timestamp in seconds)',
        'type': 'integer'
    },
    'timeframe': { 
        'description': 'Timeframe for data aggregation',
        'type': 'string'
    },
    'token': { 
        'description': 'Token address',
        'type': 'string'
    },
    'tokenAddress': { 
        'description': 'Token address',
        'type': 'string'
    },
    'tokens': { 
        'description': 'Token addresses',
        'type': 'array'
    },
    'type': { 
        'description': 'Time interval (e.g., “1s”, “1m”, “1h”, “1d”)',
        'type': 'string'
    },
    'wallet': { 
        'description': 'Wallet address',
        'type': 'string'
    }
}


export { paramMetadata }