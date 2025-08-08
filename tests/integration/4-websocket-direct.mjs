import { DataWebsocket } from '../src/task/Websocket.mjs'
import { getEnv } from './helpers/utils.mjs'
import { config } from '../src/data/config.mjs'


const { wsUrl } = getEnv( {
    'path': '../../../.env',
    'selection': [ [ 'wsUrl', 'SOLANA_TRACKER_DATASTREAM' ] ]
} )
 

const ws = new DataWebsocket({ wsUrl, websocket: { websocket: config.websocket } })
// Verbindung aktiv herstellen
ws.connect()

// Watchdog: Wenn nach 5s kein Socket bereit ist -> Hinweis
setTimeout( () => {
    const internal = ws?.getInternalState ? ws.getInternalState() : null
    const ready = internal ? Object.values( internal.websocketsReady || {} ).some( v => v ) : 'unknown'
    if( ready !== true && ready !== 'unknown' ) {
        console.warn( '[Test] Websocket scheint nicht bereitzustehen – prüfe wsUrl / Auth / Netzwerk. wsUrl=', wsUrl )
    }
}, 5000 )
const filter1 = ws.addFilter( { 
    'funcName': 'isPumpFun', 
    'func': ( data ) => { 
        return data['token']['createdOn'] === 'https://pump.fun'
    }
} )
const filter2 = ws.addFilter( { 
    'funcName': 'hasSocialMedia', 
    'func': ( data ) => { 
        return data['risk']['risks'].find( a => a['name'] === 'No social media' ) === undefined
    }
} )
const modifier1 = ws.addModifier( { 
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
ws.updateRoom( { roomId, 'type': 'join', params, 'filters': [ filter1, /*filter2*/ ], 'modifiers': [ modifier1 ] } )
ws.on( roomId, ( data ) => { console.log( 'Websocket inside:', JSON.stringify(data, null, 2 ) ) } )