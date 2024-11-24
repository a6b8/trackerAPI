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


class EventWrapper extends EventEmitter {
    #state


    constructor( { apiKey } ) {
        super()

        this.#state = {
            'id': -1,
            apiKey
        }
    }


    async request( { route, params={} } ) {
        // Wrapper for SolanaTracker.request
        const event = 'request'
        const { id } = this.#getId()

        const data = {}
        this.#sendEvent( { event, id, data } )
        return id
    }


    async getTx( params={} ) {
        // Wrapper for Swap.getTx
        const event = 'getTx'
        const { id } = this.#getId()

        const data = {}
        this.#sendEvent( { event, id, data } )
        return id
    }


    #getId() { 
        this.#state['id'] += 1 
        return { 'id': this.#state['id'] }
    }


    #sendEvent( { event, id, data } ) {
        const payload = { id, ...data }
        this.emit( event, payload )
        return true
    }
}


export { SolanaTracker, Swap, examples, EventWrapper }