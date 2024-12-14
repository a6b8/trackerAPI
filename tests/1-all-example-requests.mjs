import { TrackerAPI, examples } from '../src/Interface.mjs'
import { getEnv } from './helpers/utils.mjs'

const { apiKey } = getEnv( {
    'path': '../../../.env',
    'selection': [
        [ 'apiKey', 'SOLANA_TRACKER_API_KEY' ]
    ]
} )

const data = new TrackerAPI( { apiKey } )
const exampleKeys = Object.keys( examples )
const delay = ms => new Promise( resolve => setTimeout( resolve, ms ) )

for( let i = 0; i < exampleKeys.length; i++ ) {
    const { route, params } = examples[ exampleKeys[ i ] ]
    const response = await data.getData( { route, params } )

    const d = {
        'request': { route, params },
        'response': response
    }
    // fs.writeFileSync( `./examples/${route}.json`, JSON.stringify( d, null, 4 ) )
    console.log( `[${i}]  ${response['status']}\t${response['data']['error'] === undefined }\t${route}` )
    await delay( 1000 )
}