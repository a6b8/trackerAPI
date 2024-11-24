import { EventWrapper } from '../src/index.mjs'


const ew = new EventWrapper( { apiKey: '123' } )
const delay = ms => new Promise( resolve => setTimeout( resolve, ms ) )

ew.on( 'request', ( data ) => {
    console.log( 'request', data )
} ) 


for( let i = 0; i < 10; i++ ) {
    ew.request( { 'route': 'health', 'params': {} } )
    await delay( 1000 )
}



