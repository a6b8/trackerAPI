import { DataWebsocket } from '../src/task/Websocket2.mjs'
import { getEnv } from './helpers/utils.mjs'


const { wsUrl } = getEnv( {
    'path': '../../../.env',
    'selection': [ [ 'wsUrl', 'SOLANA_TRACKER_DATASTREAM' ] ]
} )
 

const ws = new DataWebsocket( { wsUrl } )

ws.addStrategy( {
    'name': 'newOne',
    'filters': [ 'isPumpFun', /*'hasSocialMedia'*/ ],
    'modifiers': [ 'essentialData' ]
} )

const roomId = `graduatingTokens`
const t = ws.updateRoom( { 
    roomId, //'priceUpdates', 
    'type': 'join', 
    'params': { 'poolId': '9xxoUCtd9FASN8Xg6UttonrgZcbWfwmFTJoZovbwpump' },
    'strategy': 'pumpFunTokens'
} )
ws.on( roomId, ( data ) => { console.log( 'Websocket inside:', JSON.stringify(data, null, 2 ) ) } )


/*
const roomId = `priceUpdates`
const params = { 'poolId': '43ffDBrGRNRePsoVMaG6F3oHke7Rbse4ExYcQVjxpump'} 
const t = ws.updateRoom( { roomId, 'type': 'join', params } )
console.log( t )


*/