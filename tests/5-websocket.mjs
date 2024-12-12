import { DataWebsocket } from '../src/task/Websocket2.mjs'
import { getEnv } from './helpers/utils.mjs'


const { wsUrl } = getEnv( {
    'path': '../../../.env',
    'selection': [ [ 'wsUrl', 'SOLANA_TRACKER_DATASTREAM' ] ]
} )
 

const ws = new DataWebsocket( { wsUrl } )

const a = ws.addStrategy( {
    'name': 'newOne',
    'struct': {
        'filters': {
            'isPumpFun': null,
            'newToken': {
                'func': ( data ) => {
                    return data['pools'][ 0 ]['openTime'] === 0 || data['pools'][ 0 ]['openTime'] === '0'
                }
            }
        },
        'modifiers': {
            'essentialData': null
        }
    }
} )


const roomId = 'latestTokensPools'
const t = ws.updateRoom( { 
    roomId,
    'type': 'join', 
    'params': { 'poolId': '9xxoUCtd9FASN8Xg6UttonrgZcbWfwmFTJoZovbwpump' },
    'strategy': 'newOne'
} )


ws.on( roomId, ( data ) => { 
    console.log( data ) 
} )


/*
    const roomId = `priceUpdates`
    const params = { 'poolId': '43ffDBrGRNRePsoVMaG6F3oHke7Rbse4ExYcQVjxpump'} 
    const t = ws.updateRoom( { roomId, 'type': 'join', params } )
    console.log( t )
*/