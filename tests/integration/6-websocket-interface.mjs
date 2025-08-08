import { TrackerAPI } from '../src/Interface.mjs'
import { getEnv } from './helpers/utils.mjs'


const { wsUrl } = getEnv( {
    'path': '../../../.env',
    'selection': [ [ 'wsUrl', 'SOLANA_TRACKER_DATASTREAM' ] ]
} )

const ws = new TrackerAPI( { apiKey: 'test', wsUrl } )

// Create filters using new system
const isPumpFunFilter = ws.addWebsocketFilter( {
    'funcName': 'isPumpFun',
    'func': ( data ) => data['token']['createdOn'] === 'https://pump.fun'
} )

const newTokenFilter = ws.addWebsocketFilter( {
    'funcName': 'newToken', 
    'func': ( data ) => {
        return data['pools'][ 0 ]['openTime'] === 0 || data['pools'][ 0 ]['openTime'] === '0'
    }
} )

const shrinkTransactionsModifier = ws.addWebsocketModifier( {
    'funcName': 'shrinkTransactions',
    'func': ( data ) => {
        return data
            .reduce( ( acc, a, index ) => {
                const { type } = a
                if( type === 'buy' ) { acc[ 0 ] += 1 }
                if( type === 'sell' ) { acc[ 1 ] += 1 }
                return acc
            }, [ 0, 0 ] )
    }
} )

// Essential data modifier
const essentialDataModifier = ws.addWebsocketModifier( {
    'funcName': 'essentialData',
    'func': ( data ) => {
        const { name, mint, twitter, website } = data['token']
        const pumpFun = `https://pump.fun/coin/${mint}`
        const deployer = data['pools'][ 0 ]['deployer']
        return { name, mint, twitter, website, pumpFun, deployer }
    }
} )


const roomId = 'latestTokensPools'
const t = ws.updateWebsocketRoom( { 
    roomId,
    'type': 'join', 
    'params': { 'poolId': '9xxoUCtd9FASN8Xg6UttonrgZcbWfwmFTJoZovbwpump' },
    'filters': [ isPumpFunFilter, newTokenFilter ],
    'modifiers': [ essentialDataModifier ]
} )


let count = 0
let watchlist = {}

ws.connectWebsocket()
ws.on( roomId, ( data ) => { 
    console.log( data ) 

    count += 1
    if( count === 1 ) {
        const t = ws.updateWebsocketRoom( { roomId, 'type': 'leave' } )
        count = 0
        const { mint, name } = data
        watchlist[ mint ] = { name, 'transactions': [ 0, 0 ], 'price': { start: null, 'current': null } }

        ws.updateWebsocketRoom( {
            'roomId': 'transactions', // 'priceUpdates'
            'type': 'join',
            'params': { 'tokenAddress': mint },
            'modifiers': [ shrinkTransactionsModifier ]
        } )

        ws.updateWebsocketRoom( {
            'roomId': 'priceUpdates', // 'priceUpdates'
            'type': 'join',
            'params': { 'poolId': mint }
        } )
        console.log( t )
    }
} )


ws.on( 'transactions', ( data ) => { 
    // console.log( JSON.stringify( data, null, 2 ) )
    console.log( data )
} )


ws.on( 'priceUpdates', ( data ) => { 
    // console.log( JSON.stringify( data, null, 2 ) )
    console.log( data )
} )


/*
    const roomId = `priceUpdates`
    const params = { 'poolId': '43ffDBrGRNRePsoVMaG6F3oHke7Rbse4ExYcQVjxpump'} 
    const t = ws.updateRoom( { roomId, 'cmd': 'join', params } )
    console.log( t )
*/