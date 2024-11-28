import { Data, examples } from '../src/index.mjs'
import { endpoints } from '../src/data/endpoints.mjs'
import { paramMetadata } from '../src/data/paramMetadata.mjs'
import { swap } from '../src/data/swap.mjs'

import { getEnv } from './helpers/utils.mjs'
import fs from 'fs'

const { apiKey } = getEnv( {
    'path': '../../../.env',
    'selection': [
        [ 'apiKey', 'SOLANA_TRACKER_API_KEY' ]
    ]
} )

const data = new Data( { apiKey } )
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
        acc += `await data.getData( ${JSON.stringify( p, null, 4)} )\n`
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
        acc += `\n> [See response here](./examples/${k}.json)`

        acc += `\n\n`
        return acc
    }, '' )

const overview = Object
    .entries( endpoints )
    .sort( ( [ a, ], [ b, ] ) => a.localeCompare( b ) )
    .reduce( ( acc, [ k, vs ], index ) => {
        const { description, inserts, query, body, example, requestMethod, route } = vs
        if( index === 0 ) {
           acc += `| Key | Route | Description | Example | Response |\n`
           acc += `| --- | --- | --- |--- |--- |\n`
        }
        const routeStr = `${requestMethod} ${route}`
        acc += `| ${k} | ${routeStr} | ${description} | [X](./EXAMPLES.md?#${k}) | [X](./examples/${k}.json) |\n`
        return acc
    }, '' )

let all = ''
// all += `## Routes\n\n`
all += 'This overview provides a list of all available methods and their descriptions.\n\n'
all += overview

const swapParams = Object
    .entries( swap )
    .reduce( ( acc, [ k, v ], i ) => {
        if( i === 0 ) {
            acc += `| Key | Description | Required | Example |\n`
            acc += `| --- | --- | --- | --- |\n`
        }
        const { description, required, example } = v
        acc += `| ${k} | ${description} | ${required} | ${example} |\n`

        return acc
    }, '' )

let str = fs.readFileSync( `./old/Template-en.md`, 'utf-8' )
str = str
    .replace( '<<INSERT_ROUTES>>', all )
    .replace( '<<INSERT_SWAP_QUOTE>>',swapParams )
fs.writeFileSync( `README.md`, str )

let ex = ''
ex += `# Examples\n\n`
ex += 'The following examples demonstrate the usage of the methods.\n\n'
ex += routes

const tmp2 = fs.writeFileSync( `EXAMPLES.md`, ex )



//         'required': true,
// 'description': 'The base token address',
// 'example':

