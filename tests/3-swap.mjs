import { TrackerAPI } from '../src/Interface.mjs'
import { getEnv } from './helpers/utils.mjs'


const { privateKey, publicKey, apiKey, nodeUrl } = getEnv( {
    'path': '../../../.env',
    'selection': [
        [ 'privateKey', 'SOLANA_PRIVATE_KEY'     ],
        [ 'publicKey',  'SOLANA_PUBLIC_KEY'      ],
        [ 'apiKey',     'SOLANA_TRACKER_API_KEY' ],
        [ 'nodeUrl',    'SOLANA_MAINNET_HTTPS'   ]
    ]
} )

const st = new TrackerAPI( { apiKey, nodeUrl } )
let quote = await st.getQuote( {
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

const txid = await st.sendSwap( { quote, privateKey, areYouSure: false } )
console.log( 'tx', txid )

/*
    const test = swap.parseTx( { response } )
    console.log( test)
*/