const swap = {
    'from': {
        'required': true,
        'description': 'The base token address',
        'example': 'So11111111111111111111111111111111111111112 (SOL)'
    },
    'to': {
        'required': true,
        'description': 'The quote token address',
        'example': '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R (RAY)'
    },
    'amount': {
        'required': true,
        'description': 'The amount of the base token to swap. Can be a specific value, "auto" to use full wallet amount, or a percentage (e.g., "50%") to use that portion of the wallet balance',
        'examples': ['1', 'auto', '50%']
    },
    'slippage': {
        'required': true,
        'description': 'Maximum acceptable slippage percentage',
        'example': 10
    },
    'payer': {
        'required': true,
        'description': 'Public key of the wallet sending the transaction',
        'example': 'PAYER_ADDRESS'
    },
    'priorityFee': {
        'required': false,
        'description': 'Amount in SOL to increase transaction processing priority',
        'examples': ['0.000005', 'auto']
    },
    'priorityFeeLevel': {
        'required': false,
        'description': 'Required if priorityFee is set to auto',
        'examples': ['min', 'low', 'medium', 'high', 'veryHigh', 'unsafeMax']
    },
    'txVersion': {
        'required': false,
        'description': 'Transaction version',
        'examples': ['v0', 'legacy']
    },
    'fee': {
        'required': false,
        'description': 'Charge a custom fee to your users for each transaction (earn sol for each swap)',
        'example': 'WALLET_ADDRESS:PERCENTAGE',
        'note': 'Add multiple fees by separating them with a comma'
    },
    'feeType': {
        'required': false,
        'description': 'Fee application type',
        'default': 'add',
        'examples': ['add', 'deduct']
    }
}


export { swap }