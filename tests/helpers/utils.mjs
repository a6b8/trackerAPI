import fs from 'fs'

function getEnv( { path, selection } ) {
/*
    const selection = [
        [ 'privateKey', 'SOLANA_PRIVATE_KEY'     ],
        [ 'publicKey',  'SOLANA_PUBLIC_KEY'      ],
        [ 'apiKey',     'SOLANA_TRACKER_API_KEY' ],
        [ 'nodeUrl',    'SOLANA_MAINNET_HTTPS'   ]
    ]
*/

    const result = fs.readFileSync( path, 'utf-8' )
        .split( "\n" )
        .map( line => line.split( '=' ) )
        .reduce( ( acc, [ k, v ], i ) => {
            const find = selection.find( ( [ key, value ] ) => value === k )
            if( find ) { acc[ find[ 0 ] ] = v }
            return acc
        }, {} )
    return result
}


export { getEnv }