import { Data } from './task/Data.mjs'
import { Swap } from './task/Swap.mjs'
import { endpoints } from './data/endpoints.mjs '

import EventEmitter from 'events'


const examples = Object
    .entries( endpoints )
    .reduce( ( acc, [ key, value ], index ) => {
        acc[ key ] = { 'route': key, 'params': value['example'] }
        return acc
    }, {} )


class TrackerAPI extends EventEmitter {
    #state
    #data
    #swap


    constructor( { apiKey, nodeUrl } ) {
        super()

        this.#state = {
            'id': -1,
            apiKey,
            nodeUrl
        }

        if( apiKey !== undefined ) {
            this.#data = new Data( { apiKey } ) 
        }
        if( nodeUrl !== undefined ) { 
            this.#swap = new Swap( { nodeUrl } ) 
        }
    }

/*
    batchGetData( { route, params={}, isAsync=true } ) {
        const event = 'gD'
        const { id } = this.#getId()

        if( !isAsync ) {
            ( async () => {
                const data = await this.#data.getData( { route, params } )
                this.#sendEvent({ event, id, data } )
            } )()
            return { id }
        }

        return ( async () => {
            const data = await this.#data.getData( { route, params } )
            this.#sendEvent( { event, id, data } )
            return { ...data, id }
        } )()
    }
*/

    async getData( { route, params={}} ) {
        this.#validateModule( { 'key': 'data' } )
        const event = 'request'
        const { id } = this.#getId()
        const data = await this.#data.getData( { route, params } )
        // this.#sendEvent( { event, id, data } )
        return { ...data, id }
    }


    getRoutes() {
        this.#validateModule( { 'key': 'data' } )
        return this.#data.getRoutes()
    }


    async getSwapQuote( params ) {
        this.#validateModule( { 'key': 'swap' } )
        const event = 'getTx'
        const { id } = this.#getId()
        const data = await this.#swap.getSwapQuote( params )
        // this.#sendEvent( { event, id, data } )
        return { ...data, id }
    }


    async postSwap( { quote, privateKey, skipConfirmation=false } ) {
        this.#validateModule( { 'key': 'swap' } )
        const event = 'sendTx'
        const { id } = this.#getId()
        const data = await this.#swap.postSwap( { quote, privateKey, skipConfirmation } )
        this.#sendEvent( { event, id, data } )
        return { ...data, id }
    }


    health() {
        return true
    }


    #getId() { 
        this.#state['id'] += 1
        const { id } = this.#state
        return { id }
    }


    #sendEvent( { event, id, data } ) {
        const payload = { id, ...data }
        this.emit( event, payload )
        return true
    }


    #validateModule( { key } ) {
        const [ , value, initKey ] = [
            [ 'data', this.#data, 'apiKey' ],
            [ 'swap', this.#swap, 'nodeUrl' ]
        ]
            .find( ( [ k, ] ) => k === key )

        if( value === undefined ) {
            throw new Error( `Key ${initKey} is not defined` )
        } 

        return true
    }
}


export { TrackerAPI, Data, Swap, examples }