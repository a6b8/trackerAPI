import { TrackerWebsocket } from '../src/task/Websocket.mjs'
import { getEnv } from './helpers/utils.mjs'


const { wsUrl } = getEnv( {
    'path': '../../../.env',
    'selection': [ [ 'wsUrl', 'SOLANA_TRACKER_DATASTREAM' ] ]
} )

const ws = new TrackerWebsocket( { wsUrl } )
const a = [
    {
        'name': 'newOne',
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
    },
    {
        'name': 'minimalTransactionInformation',
        'filters': {},
        'modifiers': {
            'shrinkTransactions': {
                'func': ( data ) => {
                    return data
                        .reduce( ( acc, a, index ) => {
                            const { type } = a
                            if( type === 'buy' ) { acc[ 0 ] += 1 }
                            if( type === 'sell' ) { acc[ 1 ] += 1 }
                            return acc
                        }, [ 0, 0 ] )
                }
            }
        }
    }
]
    .forEach( ( { name, filters, modifiers }, index ) => {
        const { status, messages, data } = ws.addStrategy( { name, filters, modifiers } )
        if( !status ) { console.log( index, a ) }
    } )





const roomId = 'latestTokensPools'
const t = ws.updateRoom( { 
    roomId,
    'cmd': 'join', 
    'params': { 'poolId': '9xxoUCtd9FASN8Xg6UttonrgZcbWfwmFTJoZovbwpump' },
    'strategy': 'newOne'
} )


let count = 0
let watchlist = {}

ws.connect()
ws.on( roomId, ( data ) => { 
    console.log( data ) 

    count += 1
    if( count === 1 ) {
        const t = ws.updateRoom( { roomId, 'cmd': 'leave' } )
        count = 0
        const { mint, name } = data
        watchlist[ mint ] = { name, 'transactions': 0, 'price': { start: null, 'current': null } }

        ws.updateRoom( {
            'roomId': 'transactions', // 'priceUpdates'
            'cmd': 'join',
            'params': { 'tokenAddress': mint },
            'strategy': 'minimalTransactionInformation'
        } )
        console.log( t )
    }
} )


ws.on( 'transactions', ( data ) => { 
    // console.log( JSON.stringify( data, null, 2 ) )
    console.log( data )
} )


/*
    const roomId = `priceUpdates`
    const params = { 'poolId': '43ffDBrGRNRePsoVMaG6F3oHke7Rbse4ExYcQVjxpump'} 
    const t = ws.updateRoom( { roomId, 'type': 'join', params } )
    console.log( t )
*/