import { SolanaTracker, examples } from '../src/index.mjs'
import fs from 'fs'


const apiKey = fs.readFileSync( '../../../.env', 'utf-8' )
    .split( "\n" )
    .map( line => line.split( '=' ) )
    .find( ( [ key, value ] ) => key === 'SOLANA_TRACKER_API_KEY' )[ 1 ]

const st = new SolanaTracker( { apiKey } )
const exampleKeys = Object.keys( examples )
const delay = ms => new Promise( resolve => setTimeout( resolve, ms ) )

for( let i = 0; i < exampleKeys.length; i++ ) {
    const { route, params } = examples[ exampleKeys[ i ] ]
    const response = await st.request( { route, params } )

    const d = {
        'request': { route, params },
        'response': response
    }
    // fs.writeFileSync( `./examples/${route}.json`, JSON.stringify( d, null, 4 ) )
    console.log( `[${i}]  ${response['status']}\t${response['data']['error'] === undefined }\t${route}` )
    await delay( 1000 )
}