import { DataWebsocket } from '../src/task/Websocket2.mjs'
import { getEnv } from './helpers/utils.mjs'


const { wsUrl } = getEnv( {
    'path': '../../../.env',
    'selection': [ [ 'wsUrl', 'SOLANA_TRACKER_DATASTREAM' ] ]
} )
 

const ws = new DataWebsocket( { wsUrl } )
ws.addFilter( { 
    'funcName': 'isPumpFun', 
    'func': ( data ) => { 
        return data['token']['createdOn'] === 'https://pump.fun'
    }
} )
ws.addFilter( { 
    'funcName': 'hasSocialMedia', 
    'func': ( data ) => { 
        return data['risk']['risks'].find( a => a['name'] === 'No social media' ) === undefined
    }
} )
ws.addModifier( { 
    'funcName': 'isData',
    'func': ( data ) => { 
        const { name, mint, twitter, website } = data['token']
        const pumpFun = `https://pump.fun/coin/${mint}`
        const result = {
            name, mint, twitter, website, pumpFun,
            'deployer': data['pools'][ 0 ]['deployer'],
            // 'risk': data['risk'],
        }
        return result

        // return data
    } 
} )


const tokenId = `6VJ4xpy2NwG5hPpFoqU7HCFqk1QbQG52rQ17ZrQzNaVM`
const poolId = 'GmJaZvdNptvofC4qe3tvuBNgqLm65p1of5pk6JFHpump'
let roomId = `graduatingTokens`
const params = { poolId } 
ws.updateRoom( { roomId, 'type': 'join', params, 'filters': [ 'isPumpFun', /*'hasSocialMedia'*/ ], 'modifiers': [ 'isData' ] } )
ws.on( roomId, ( data ) => { console.log( 'Websocket inside:', JSON.stringify(data, null, 2 ) ) } )