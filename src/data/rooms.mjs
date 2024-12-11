const rooms = {
	'rooms': {
		'latestTokensPools': {
			'isTransaction': false,
			'struct': 'latest',
			'variables': []
		},
		'poolChanges': {
			'isTransaction': false,
			'struct': 'pool:{{poolId}}',
			'variables': [
				['poolId', 'string']
			]
		},
		'pairTransactions': {
			'isTransaction': true,
			'struct': 'transaction:{{tokenAddress}}:{{poolId}}',
			'variables': [
				['tokenAddress', 'solanaAddress'],
				['poolId', 'string']
			]
		},
		'transactions': {
			'isTransaction': true,
			'struct': 'transaction:{{tokenAddress}}',
			'variables': [
				['tokenAddress', 'solanaAddress']
			]
		},
		'pairAndWalletTransactions': {
			'isTransaction': true,
			'struct': 'transaction:{{tokenAddress}}:{{poolId}}:{{walletAddress}}',
			'variables': [
				['tokenAddress', 'solanaAddress'],
				['poolId', 'string'],
				['walletAddress', 'solanaAddress']
			]
		},
		'priceUpdates': {
			'isTransaction': false,
			'struct': 'price:{{poolId}}',
			'variables': [
				['poolId', 'string']
			]
		},
		'priceByToken': {
			'isTransaction': false,
			'struct': 'price-by-token:{{tokenId}}',
			'variables': [
				['tokenId', 'string']
			]
		},
		'walletTransactions': {
			'isTransaction': false,
			'struct': 'wallet:{{walletAddress}}',
			'variables': [
				['walletAddress', 'solanaAddress']
			]
		},
		'graduatingTokens': {
			'isTransaction': false,
			'struct': 'graduating',
			'variables': []
		},
		'graduatingTokensWithCap': {
			'isTransaction': false,
			'struct': 'graduating:{{token}}:{{marketCap}}',
			'variables': [
				['token', 'string'],
				['marketCap', 'number']
			]
		},
		'graduatedTokens': {
			'isTransaction': false,
			'struct': 'graduated',
			'variables': []
		}
	},
	'validation': {
		'string': {
			'regex': /^[\w\s]+$/,
			'message': 'Input must be a string containing alphanumeric characters or spaces'
		},
		'number': {
			'regex': /^\d+(\.\d+)?$/,
			'message': 'Input must be a valid integer or decimal number'
		},
		'solanaAddress': {
			'regex': /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
			'message': 'Input must be a valid Solana address in Base58 format, 32-44 characters long'
		}
	},
	'default': {
		'filters': {
			'isPumpFun': {
				'func': data => { return data['token']['createdOn'] === 'https://pump.fun' },
				'description': 'Filter tokens created on pump.fun'
			},
			'hasSocialMedia': {
				'func': data => { return data['risk']['risks'].find( a => a['name'] === 'No social media' ) === undefined },
				'description': 'Filter tokens with no social media'
			}
		},
		'modifiers': {
			'essentialData': {
				'func': data => {
					const { name, mint, twitter, website } = data['token']
					const pumpFun = `https://pump.fun/coin/${mint}`
					const deployer = data['pools'][ 0 ]['deployer']
					const result = { name, mint, twitter, website, pumpFun, deployer }
					return result
				},
				'description': 'Extract essential data from token'
			}
		},
		'strategies': {
			'pumpFunTokens': {
				'filters': [ 'isPumpFun', 'hasSocialMedia' ],
				'modifiers': [ 'essentialData' ],
				'description': 'Filter tokens created on pump.fun with social media'
			}
	}
}


export { rooms }