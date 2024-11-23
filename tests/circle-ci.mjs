import { SolanaTracker } from '../src/index.mjs'

const apiKey = '<<API_KEY>>'
const st = new SolanaTracker( { apiKey } )
const status = st.health()

if( status ) {
    console.log( 'Success' )
    process.exit( 0 )
} else {
    console.log( 'Failure' )
    process.exit( 1 )
}
