import { SolanaTracker, examples } from '../src/index.mjs'
import fs from 'fs'
import { endpoints } from '../src/data/endpoints.mjs'
import { paramMetadata } from '../src/data/paramMetadata.mjs'

const apiKey = fs.readFileSync( '../../../.env', 'utf-8' )
    .split( "\n" )
    .map( line => line.split( '=' ) )
    .find( ( [ key, value ] ) => key === 'SOLANA_TRACKER_API_KEY' )[ 1 ]

const st = new SolanaTracker( { apiKey } )
const exampleKeys = Object.keys( examples )

const routes = Object
    .entries( endpoints )
    .sort( ( [ a, ], [ b, ] ) => a.localeCompare( b ) )
    .reduce( ( acc, [ k, vs ], index ) => {
        const { description, inserts, query, body, example, requestMethod } = vs
        acc += `#### ${k}\n\n`
        acc += `${description}\n\n`

        let vars = [ ...inserts.map( k => [ k, true ] ) ]
        if( query ) { vars = [ ...vars, ...Object.entries( query ) ] }
        if( body ) { vars = [ ...vars, ...Object.entries( body ) ] }
        // vars = vars.filter( a => a[ 1 ] === true )

        // vars.sort( ( [ , a ], [ , b ] ) => b - a )
        const p = { route: k, params: example }
        acc += "\n"
        acc += "```js\n"
        acc += `await st.request( ${JSON.stringify( p, null, 4)} )\n`
        acc += "```\n\n"
        acc += vars
            .sort( ( [ ,a ], [ ,b ] ) => b - a )
            .reduce( ( abb, b, rindex ) => {
                if( rindex === 0 ) {
                    abb += `**Parameters**\n\n`
                    abb += `| Parameter | Required | Type | Description |\n`
                    abb += `| --- | --- | --- | --- |\n`
                }

                const [ key, required ] = b
                const { type, description } = paramMetadata[ key ]
                abb += `| ${key} | ${required ? 'Yes' : 'No'} | ${type} | ${description} |\n`

                return abb
            }, '' )

        acc += `\n\n`
        return acc
    }, '' )

const overview = Object
    .entries( endpoints )
    .sort( ( [ a, ], [ b, ] ) => a.localeCompare( b ) )
    .reduce( ( acc, [ k, vs ], index ) => {
        const { description, inserts, query, body, example, requestMethod } = vs
        if( index === 0 ) {
            acc += `| Route | Description |\n`
            acc += `| --- | --- |\n`
        }
        acc += `| [${k}](#${k}) | ${description} |\n`


        // acc += `${description}\n\n`
        return acc
    }, '' )

let all = ''
// all += `## Routes\n\n`
all += 'This overview provides a list of all available methods and their descriptions.\n\n'
all += overview
all += `\n\n**Examples**\n\n`
all += 'The following examples demonstrate the usage of the methods.\n\n'
all += routes

const tmp = fs.readFileSync( `./old/Template-en.md`, 'utf-8' )
const str = tmp.replace( '<<INSERT_EXAMPLES>>', all )
fs.writeFileSync( `README.md`, str )

