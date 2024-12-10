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
	}
}


export { rooms }