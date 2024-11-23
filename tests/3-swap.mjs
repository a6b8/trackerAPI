import { Swap } from '../src/index.mjs'
import { config } from '../src/data/config.mjs'


const { solanaTracker } = config
const swap = new Swap( { solanaTracker } )


const response = await swap.getTx( {
    'from': "So11111111111111111111111111111111111111112",
    'to': "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    'amount': 1,
    'slippage': 15,
    'payer': "arsc4jbDnzaqcCLByyGo7fg7S2SmcFsWUzQuDtLZh2y",
    'priorityFee': 0.0005,
    'feeType': "add",
    'fee': "arsc4jbDnzaqcCLByyGo7fg7S2SmcFsWUzQuDtLZh2y:0.1"
} )

console.log( response )

const test = swap.parseTx( { response } )
console.log( test)