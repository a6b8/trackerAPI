import { TrackerAPI, examples } from '../src/index.mjs'
import { getEnv } from './helpers/utils.mjs'


const { apiKey, nodeUrl } = getEnv( {
    'path': '../../../.env',
    'selection': [
        [ 'apiKey',     'SOLANA_TRACKER_API_KEY' ],
        [ 'nodeUrl',    'SOLANA_MAINNET_HTTPS'   ]
    ]
} )


const tr = new TrackerAPI( { apiKey, nodeUrl } )
const delay = ms => new Promise( resolve => setTimeout( resolve, ms ) )

tr.on( 'gD', ( data ) => {
    console.log( 'gD', data )
    // console.log( 'request', data )
} ) 

const keys = Object.keys( examples )
for( let i = 0; i < 10; i++ ) {
    const { route, params } = examples[ keys[ i ] ]
    const { id, data } = await tr.gD( { route, params, 'isAsync': true } )
    console.log( 'id', id )
    console.log( 'data', data )
    console.log( '...')
    await delay( 1000 )
}



