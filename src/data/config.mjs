const config = {
    // 'dataUrl': 'https://data.solanatracker.io',
    // 'swapUrl': 'https://swap-v2.solanatracker.io/swap',
    'data': {
        'rootUrl': 'https://data.solanatracker.io',
    },
    'swap': {
        'eventPrefix': 'swap',
        'rootUrl': 'https://swap-v2.solanatracker.io/swap',
        'eventStates': {
            'getSwapQuote':           [ 'startGetQuote',           'endGetQuote'           ],
            'postSwapTransaction':    [ 'startPostTransaction',    'endPostTransaction'    ],
            'confirmationSignature': [ 'startConfirmTransaction', 'endConfirmTransaction' ]
        },
        'wsConfirmationsLevels': [
            { 'commitment': 'processed', 'eventStatus': 'nodeProcessed' },
            { 'commitment': 'confirmed', 'eventStatus': 'nodeConfirmed' },
            { 'commitment': 'finalized', 'eventStatus': 'nodeFinalized' }
        ]
    },
    'websocket': { 
        'reconnectDelay': 2500,
        'reconnectDelayMax': 4500,
        'randomizationFactor': 0.5,
        'socketNames': [ 'main', 'transaction' ]
    }
}


export { config }