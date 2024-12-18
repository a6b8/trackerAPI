import { Data } from './task/Data.mjs'
import { Swap } from './task/Swap.mjs'
import { TrackerWebsocket } from './task/Websocket.mjs'
import { endpoints } from './data/endpoints.mjs '
import EventEmitter from 'events'
import { config } from './data/config.mjs'


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
    #websocket
    #config


    constructor( { apiKey, nodeHttp, nodeWs, wsUrl, strictMode=true } ) {
        super()

        const { status, messages } = this.#validateConstructor( { apiKey, nodeHttp, nodeWs, wsUrl, strictMode } )
        if( status === false ) { throw new Error( messages.join( '\n' ) ) }

        this.#state = {
            'id': 0,
            apiKey,
            nodeHttp,
            nodeWs,
            wsUrl,
            strictMode
        }

        this.setConfig( { config } )
    }


    getConfig() {
        return this.#config
    }


    setConfig( { config } ) {
        const { status, messages } = this.#validateSetCursor( { config } )
        if( !status ) { throw new Error( messages.join( '\n' ) ) }

        const { data, swap, websocket } = config
        const { apiKey, nodeHttp, nodeWs, wsUrl } = this.#state

        if( apiKey !== undefined ) {
            this.#data = new Data( { apiKey, data } ) 
        }
        if( nodeHttp !== undefined ) { 
            const emitter = this.emit.bind( this )
            this.#swap = new Swap( { nodeHttp, nodeWs, swap, emitter } ) 
        }

        if( wsUrl !== undefined ) {
            const emitter = this.emit.bind( this )
            this.#websocket = new TrackerWebsocket( { wsUrl, websocket, emitter } )
        }

        this.#config = { ...config }

        return true
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
        return { ...data, id }
    }


    getRoutes() {
        this.#validateModule( { 'key': 'data' } )
        return this.#data.getRoutes()
    }


    performSwap( { params, privateKey, skipConfirmation=false } ) {
        this.#validateModule( { 'key': 'swap' } )
        const { id } = this.#getId()
        this.#swap.getSwapQuote( params, id )
            .then( async( quote ) => {
                const data = await this.#swap.postSwapTransaction( { quote, privateKey, skipConfirmation } )
                return data
            } )
            .then( ( quote ) => {
                console.log( 'FINISHED' )
                this.emit( 'swap', { id, 'eventStatus': 'getQuote', quote } )
                return true
            } )

        return id
    }


    performBatchData( { batch } ) {
        const a = Promise.all(
            batch
                .map( async( { route, params } ) => {
                    const data = await this.getData( { route, params } )
                    return data
                } )
        )

        return true
    }


/*
    async getSwapQuote( params, id='n/a' ) {
        this.#validateModule( { 'key': 'swap' } )
        const data = await this.#swap.getSwapQuote( params )
        return { ...data, id }
    }


    async postSwapTransaction( { quote, privateKey, skipConfirmation=false } ) {
        this.#validateModule( { 'key': 'swap' } )
        const data = await this.#swap.postSwapTransaction( { quote, privateKey, skipConfirmation } )
        return { data }
    }
*/


    connectWebsocket() {
        this.#validateModule( { 'key': 'websocket' } )
        const { status, messages, data } = this.#websocket.connect()
        this.#strictMode( { status, messages, data } )
        return { status, messages, data }
    }


    updateWebsocketRoom( { roomId, cmd, params={}, strategy=null } ) {
        this.#validateModule( { 'key': 'websocket' } )
        const { status, messages, data } = this.#websocket.updateRoom( { roomId, cmd, params, strategy } )
        this.#strictMode( { status, messages, data } )
        return { status, messages, data }
    }


    addWebsocketStrategy( { name, filters={}, modifiers={} } ) {
        this.#validateModule( { 'key': 'websocket' } )
        const { status, messages, data } = this.#websocket.addStrategy( { name, filters, modifiers } )
        this.#strictMode( { status, messages, data } )
        return { status, messages, data }
    }


    health() {
        return true
    }


    #getId() { 
        const { id } = this.#state
        this.#state['id'] += 1
        return { 'id': `${id}` }
    }


/*
    #sendEvent( { event, id, data } ) {
        const payload = { id, ...data }
        this.emit( event, payload )
        return true
    }
*/


    #validateModule( { key } ) {
        const [ , value, initKey ] = [
            [ 'data',      this.#data,      'apiKey'  ],
            [ 'swap',      this.#swap,      'nodeUrl' ],
            [ 'websocket', this.#websocket, 'wsUrl'   ]
        ]
            .find( ( [ k, ] ) => k === key )

        if( value === undefined ) {
            throw new Error( `Key ${initKey} is not defined` )
        } 

        return true
    }


    #validateConstructor( { apiKey, nodeHttp, nodeWs, wsUrl, strictMode } ) {
        const messages = []

        if( apiKey === undefined ) {
            messages.push( 'apiKey is required' )
        } else if( typeof apiKey !== 'string' ) {
            messages.push( 'apiKey must be a string' )
        }

        if( nodeHttp !== undefined && typeof nodeHttp !== 'string' ) {
            messages.push( 'nodeHttp must be a string' )
        }

        if( nodeWs !== undefined && typeof nodeWs !== 'string' ) {
            messages.push( 'nodeWs must be a string' )
        }

        if( wsUrl !== undefined && typeof wsUrl !== 'string' ) {
            messages.push( 'wsUrl must be a string' )
        }

        if( strictMode === undefined ) {
            messages.push( 'strictMode is required' )
        } else if( typeof strictMode !== 'boolean' ) {
            messages.push( 'strictMode must be a boolean' )
        }

        const status = messages.length === 0

        return { status, messages }
    }


    #validateSetCursor( { config } ) {
        const messages = []

        if( config === undefined ) {
            messages.push( 'config is required' )
        } else if( typeof config !== 'object' ) {
            messages.push( 'config must be an object' )
        }

        const status = messages.length === 0
        
        return { status, messages }
    }


    #strictMode( { status, messages, data } ) {
        if( this.#state['strictMode'] && !status ) {
            throw new Error( messages.join( '\n' ) )
        }

        return true
    }
}


export { TrackerAPI, Data, Swap, TrackerWebsocket, examples }