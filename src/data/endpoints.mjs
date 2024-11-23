// https://docs.solanatracker.io


const endpoints = {
    'tokenInformation': {
        'requestMethod': 'GET',
        'description': 'Retrieve all information for a specific token.',
        'route': '/tokens/{tokenAddress}',
        'inserts': [ 'tokenAddress' ],
        'example': {
            'tokenAddress': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
    },
    'tokenHolders': {
        'requestMethod': 'GET',
        'description': 'Get the top 100 holders for a specific token.',
        'route': '/tokens/{tokenAddress}/holders',
        'inserts': [ 'tokenAddress' ],
        'example': {
            'tokenAddress': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
    },
    'tokenAth': {
        'requestMethod': 'GET',
        'description': 'Retrieve the all time high price of a token (since data api started recording)',
        'route': '/tokens/{tokenAddress}/ath',
        'inserts': [ 'tokenAddress' ],
        'example': {
            'tokenAddress': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
    },
    'search': {
        'requestMethod': 'GET',
        'description': 'The /search endpoint provides a flexible search interface for pools and tokens with support for multiple filtering criteria and pagination.',
        'route': '/search',
        'inserts': [],
        'query': {
            'query': true,
            'page': false,
            'limit': false,
            'minLiquidity': false,
            'maxLiquidity': false,
            'minMarketCap': false,
            'maxMarketCap': false,
            'minBuys': false,
            'maxBuys': false,
            'minSells': false,
            'maxSells': false,
            'minTotalTransactions': false,
            'maxTotalTransactions': false,
            'lpBurn': false,
            'market': false,
            'freezeAuthority': false,
            'mintAuthority': false,
            'deployer': false,
            'showPriceChanges': false
        },
        'example': {
            'query': 'soybean',
             'market': 'pumpfun',
        }
    },
    'latestTokens': {
        'requestMethod': 'GET',
        'description': 'Retrieve the latest 100 tokens.',
        'route': '/tokens/latest',
        'inserts': [],
        'example': {}
    },
    'trendingTokens': {
        'requestMethod': 'GET',
        'description': 'Get the top 100 trending tokens based on transaction volume in the past hour.',
        'route': '/tokens/trending',
        'inserts': [],
        'example': {}
    },
    'trendingTokensByTimeframe': {
        'requestMethod': 'GET',
        'description': 'Returns trending tokens for a specific time interval.',
        'route': '/tokens/trending/{timeframe}',
        'inserts': [ 'timeframe' ],
        'validation': {
            'timeframe': [ '', '5m', '15m', '30m', '1h', '2h', '3h', '4h', '5h', '6h', '12h', '24h' ]
        },
        'example': {
            'timeframe': '1h'
        }
    },
    'tokenVolume': {
        'requestMethod': 'GET',
        'description': 'Retrieve the top 100 tokens sorted by highest volume.',
        'route': '/tokens/volume',
        'inserts': [],
        'example': {}
    },
    'multiTokenInformation': {
        'requestMethod': 'GET',
        'description': 'Get an overview of latest, graduating, and graduated tokens (Pumpvision / Photon Memescope style).',
        'route': '/tokens/multi/all',
        'inserts': [],
        'example': {}
    },
    'graduatedTokens': {
        'requestMethod': 'GET',
        'description': 'Overview of all graduated pumpfun/moonshot tokens (Pumpvision / Photon Memescope style).',
        'route': '/tokens/multi/graduated',
        'inserts': [],
        'example': {}
    },
    'priceInformation': {
        'requestMethod': 'GET',
        'description': 'Get price information for a single token.',
        'route': '/price',
        'inserts': [],
        'query': {
            'token': true,
            'priceChanges': false
        },
        'example': {
            'token': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
    },
    'priceHistory': {
        'requestMethod': 'GET',
        'description': 'Get historic price information for a single token.', 
        'route': '/price/history',
        'inserts': [],
        'query': {
            'token': true
        },
        'example': {
            'token': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
    },
    'postPrice': {
        'requestMethod': 'POST',
        'description': 'Similar to GET /price, but accepts token address in the request body.',
        'route': '/price',
        'inserts': [],
        'body': {
            'token': true
        },
        'example': {
            'token': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
    },

    'multiPriceInformation': {
        'requestMethod': 'GET',
        'description': 'Get price information for multiple tokens (up to 100).',
        'route': '/price/multi',
        'inserts': [],
        'query': {
            'tokens': true,
            'priceChanges': false
        },
        'example': {
            'tokens': [ 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump' ]
        }
    },
    'postMultiPrice': {
        'requestMethod': 'POST',
        'description': 'Similar to GET /price/multi, but accepts an array of token addresses in the request body.',
        'route': '/price/multi',
        'inserts': [],
        'body': {
            'tokens': true,
            'priceChanges': false
        },
        'example': {
            'tokens': [ 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump' ]
        }
    },
    'walletInformation': {
        'requestMethod': 'GET',
        'description': 'Get all tokens in a wallet with current value in USD.',
        'route': '/wallet/{owner}',
        'inserts': [ 'owner' ],
        'example': {
            'owner': '95z7osZ7LcAoFkhf1ka3hWdWU8Fk8Fap69ymeeaaMruV'
        }
    },
    'walletTrades': {
        'requestMethod': 'GET',
        'description': 'Get the latest trades of a wallet.',
        'route': '/wallet/{owner}/trades',
        'inserts': [ 'owner' ],
        'query': {
            'cursor': false
        },
        'example': {
            'owner': '95z7osZ7LcAoFkhf1ka3hWdWU8Fk8Fap69ymeeaaMruV'
        }
    },
    'tokenTrades': {
        'requestMethod': 'GET',
        'description': 'Get the latest trades for a token across all pools.',
        'route': '/trades/{tokenAddress}',
        'inserts': [ 'tokenAddress' ],
        'example': {
            'tokenAddress': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
        }
    },
    'tokenTradesByPool': {
        'requestMethod': 'GET',
        'description': 'Get the latest trades for a specific token and pool pair.',
        'route': '/trades/{tokenAddress}/{poolAddress}',
        'inserts': [ 'tokenAddress', 'poolAddress' ],
        'example': {
            'tokenAddress': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
            'poolAddress': '9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW'
        }
    },
    'tokenTradesByPoolAndOwner': {
        'requestMethod': 'GET',
        'description': 'Get the latest trades for a specific token, pool, and wallet address.',
        'route': '/trades/{tokenAddress}/{poolAddress}/{owner}',
        'inserts': [ 'tokenAddress', 'poolAddress', 'owner' ],
        'example': {
            'tokenAddress': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
            'poolAddress': '9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW',
            'owner': '8bHMVvpApEQS6M2qRv4eJUDptoW919NFrBSbeDGmoGJ6'
        }
    },
    'tradesByWallet': {
        'requestMethod': 'GET',
        'description': 'Get the latest trades for a specific token and wallet address.',
        'route': '/trades/{tokenAddress}/by-wallet/{owner}',
        'inserts': [ 'tokenAddress', 'owner' ],
        'query': {
            'cursor': false,
            'showMeta': false,
            'parseJupiter': false,
            'hideArb': false
        },
        'example': {
            'tokenAddress': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
            'owner': '8bHMVvpApEQS6M2qRv4eJUDptoW919NFrBSbeDGmoGJ6'
        }
    },
    'chartData': {
        'requestMethod': 'GET',
        'description': '',
        'route': '/chart/{token}',
        'inserts': [ 'token' ],
        'example': {
            'token': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
    },
    'chartDataByPool': {
        'requestMethod': 'GET',
        'description': 'Get OLCVH (Open, Low, Close, Volume, High) data for charts.',
        'route': '/chart/{token}/{pool}',
        'inserts': [ 'token', 'pool' ],
        'query': {
            'type': false,
            'time_from': false,
            'time_to': false,
            'marketCap': false
        },
        'example': {
            'token': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
            'pool': '9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW'
        }
    },
    'profitAndLossData': {
        'requestMethod': 'GET',
        'description': 'Get Profit and Loss data for all positions of a wallet.',
        'route': '/pnl/{wallet}',
        'inserts': [ 'wallet' ],
        'query': {
            'showHistoricPnL': false
        },
        'example': {
            'wallet': '8bHMVvpApEQS6M2qRv4eJUDptoW919NFrBSbeDGmoGJ6'
        }
    },
    'firstBuyersOfToken': {
        'requestMethod': 'GET',
        'description': 'Retrieve the first 100 buyers of a token (since API started recording data) with Profit and Loss data for each wallet.',
        'route': '/first-buyers/{token}',
        'inserts': [ 'token' ],
        'example': {
            'token': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
    },
    'pnlForSpecificToken': {
        'requestMethod': 'GET',
        'description': 'Get Profit and Loss data for a specific token in a wallet.',
        'route': '/pnl/{wallet}/{token}',
        'inserts': [ 'wallet', 'token' ],
        'example': {
            'token': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
            'wallet': '8bHMVvpApEQS6M2qRv4eJUDptoW919NFrBSbeDGmoGJ6'
        }
    },
    'topTraders': {
        'requestMethod': 'GET',
        'description': 'Get the most profitable traders',
        'route': '/top-traders/all',
        'inserts': [],
        'example': {}
    },
    'paginatedTopTraders': {
        'requestMethod': 'GET',
        'description': 'Get the most profitable traders across all tokens, with optional pagination.',
        'route': '/top-traders/all/{page}',
        'inserts': [ 'page' ],
        'query': {
            'expandPnl': false,
            'sortBy': false
        },
        'example': {
            'page': 1
        }
    },
    'topTradersForToken': {
        'requestMethod': 'GET',
        'description': 'Get top 100 traders by PnL for a token.',
        'route': '/top-traders/{token}',
        'inserts': [ 'token' ],
        'example': {
            'token': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
    },
    'tokenStatsByPool': {
        'requestMethod': 'GET',
        'description': 'Get detailed stats for a token-pool pair over various time intervals.',
        'route': '/stats/{token}/{pool}',
        'inserts': [ 'token', 'pool' ],
        'example': {
            'token': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
            'pool': '9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW'
        }
    },
    'tokenStats': {
        'requestMethod': 'GET',
        'description': 'Get detailed stats for a token over various time intervals.',
        'route': '/stats/{token}',
        'inserts': [ 'token' ],
        'example': {
            'token': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
    }
}


export { endpoints }