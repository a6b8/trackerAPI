import { TrackerAPI } from '../src/Interface.mjs'
import { getEnv } from './helpers/utils.mjs'


const { privateKey, publicKey, apiKey, nodeHttp, nodeWs } = getEnv( {
    'path': '../../../.env',
    'selection': [
        [ 'privateKey', 'SOLANA_PRIVATE_KEY'     ],
        [ 'publicKey',  'SOLANA_PUBLIC_KEY'      ],
        [ 'apiKey',     'SOLANA_TRACKER_API_KEY' ],
        [ 'nodeHttp',    'SOLANA_MAINNET_HTTPS'  ],
        [ 'nodeWs',    'SOLANA_MAINNET_WSS'      ]
    ]
} )

const st = new TrackerAPI( { apiKey, nodeHttp, nodeWs } )


const params = {
    'from': 'So11111111111111111111111111111111111111112',
    'to': 'UEPp8H46WkPiBmi7nw35nyfFDNpxp9LWRPxSMHXpump',
    'amount': 0.0001,
    'slippage': 15,
    'payer': publicKey,
    'priorityFee': 0.0005,
    'feeType': 'add',
    'fee': `${publicKey}:0.0001`
}

st.on( 'swap', ( data ) => {
    console.log( data )
} )

st.createSwap( { params, privateKey, skipConfirmation: false } )


/*
let quote = await st.getSwapQuote( {
    'from': 'So11111111111111111111111111111111111111112',
    'to': 'UEPp8H46WkPiBmi7nw35nyfFDNpxp9LWRPxSMHXpump',
    'amount': 0.0001,
    'slippage': 15,
    'payer': publicKey,
    'priorityFee': 0.0005,
    'feeType': 'add',
    'fee': `${publicKey}:0.0001`
} )
console.log( 'get tx', quote  )

const txid = await st.postSwapTransaction( { quote, privateKey, skipConfirmation: false } )
*/


