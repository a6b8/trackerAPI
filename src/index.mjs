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
        // Wrapper for SolanaTracker.request
    }


    async getTx( params={} ) {
        // Wrapper for Swap.getTx
    }
}


export { SolanaTracker, Swap, examples }