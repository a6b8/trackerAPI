import { SolanaTracker } from './task/SolanaTracker.mjs'
import { Swap } from './task/Swap.mjs'
import { endpoints } from './data/endpoints.mjs '

import EventEmitter from 'events'


const examples = Object
    .entries( endpoints )
    .reduce( ( acc, [ key, value ], index ) => {
        acc[ key ] = { 'route': key, 'params': value['example'] }
        return acc
    }, {} )


class API extends EventEmitter {
    #state


    constructor( { apiKey } ) {
        super()

        this.#state = {
            'count': 0,
            apiKey
        }

    }


    async request( { route, params={} } ) {
        this.#plusOne()
        // Wrapper for SolanaTracker.request

        this.#sendEvent( { 'event': 'request', 'data': {} } )
        return true
    }


    async getTx( params={} ) {
        this.#plusOne()
        // Wrapper for Swap.getTx

        this.#sendEvent( { 'event': 'getTx', 'data': {} } )
        this.
    }


    #plusOne() { 
        this.#state['count'] += 1 
        return true
    }


    #sendEvent( { event, data } ) {
        const { count } = this.#state
        const payload = { count, ...data }
        this.emit( event, payload )
        return true
    }
}


export { SolanaTracker, Swap, examples }