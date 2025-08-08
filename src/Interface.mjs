import { Data } from './task/Data.mjs'
import { Swap } from './task/Swap.mjs'
import { TrackerWebsocket } from './task/Websocket.mjs'
import { endpoints } from './data/endpoints.mjs'
import { rooms } from './data/rooms.mjs'
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


    constructor( { apiKey, nodeHttp, nodeWs, wsUrl, silent = false } ) {
        super()

        const { status, messages } = this.#validateConstructor( { apiKey, nodeHttp, nodeWs, wsUrl, silent } )
        if( status === false ) { throw new Error( messages.join( '\n' ) ) }

        this.#state = {
            'id': 0,
            apiKey,
            nodeHttp,
            nodeWs,
            wsUrl,
            silent
        }

        this.setConfig( { config } )
        
        // Display initialization overview if not silent
        if( !silent ) {
            this.#displayInitialization()
        }
    }


    getConfig() {
        return this.#config
    }


    setConfig( { config } ) {
        const { status, messages } = this.#validateSetCursor( { config } )
        if( !status ) { throw new Error( messages.join( '\n' ) ) }

        const { data, swap, websocket } = config
        const { apiKey, nodeHttp, nodeWs, wsUrl, silent } = this.#state

        if( apiKey !== undefined ) {
            this.#data = new Data( { apiKey, data, silent } ) 
        }
        if( nodeHttp !== undefined ) { 
            const emitter = this.emit.bind( this )
            this.#swap = new Swap( { nodeHttp, nodeWs, swap, emitter, silent } ) 
        }

        if( wsUrl !== undefined ) {
            const emitter = this.emit.bind( this )
            this.#websocket = new TrackerWebsocket( { wsUrl, websocket, emitter, silent } )
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

    async queryData( { route, params={}} ) {
        this.#validateModule( { 'key': 'data' } )
        const { id } = this.#getId()
        const data = await this.#data.getData( { route, params } )
        return { ...data, id }
    }


    async performDataCollection( { batch, onError = 'throw' } ) {
        const { id } = this.#getId()
        
        // Input Validation
        const validation = this.#validateBatch( { batch } )
        if( !validation.status ) {
            if( onError === 'throw' ) {
                throw new Error( validation.messages.join( '\n' ) )
            }
            // onError === 'continue'
            this.#sendEvent( { 'event': 'collection', id, 'data': { 'status': 'error', 'error': validation.messages } } )
            return { 'status': false, 'messages': validation.messages, id }
        }
        
        this.#sendEvent( { 'event': 'collection', id, 'data': { 'status': 'started', 'total': batch.length } } )
        
        try {
            const results = await Promise.all(
                batch
                    .map( async( { route, params }, index ) => {
                        const data = await this.queryData( { route, params } )
                        this.#sendEvent( { 'event': 'collection', id, 'data': { 'status': 'progress', 'completed': index + 1, 'total': batch.length, 'result': data } } )
                        return data
                    } )
            )
            
            this.#sendEvent( { 'event': 'collection', id, 'data': { 'status': 'completed', 'results': results } } )
            return { 'status': true, 'data': results, id }
            
        } catch( error ) {
            this.#sendEvent( { 'event': 'collection', id, 'data': { 'status': 'error', 'error': error.message } } )
            return { 'status': false, 'error': error.message, id }
        }
    }


    getDataRoutes() {
        this.#validateModule( { 'key': 'data' } )
        return this.#data.getEndpoints()
    }


    getWebsocketRooms() {
        this.#validateModule( { 'key': 'websocket' } )
        return Object.keys( rooms.rooms )
    }


    performSwap( { params, privateKey, skipConfirmation=false, onError = 'throw' } ) {
        this.#validateModule( { 'key': 'swap' } )
        const { id } = this.#getId()
        
        // Input Validation
        const validation = this.#validateSwapParams( { params } )
        if( !validation.status ) {
            if( onError === 'throw' ) {
                throw new Error( validation.messages.join( '\n' ) )
            }
            // onError === 'continue'
            this.emit( 'swap', { id, 'eventStatus': 'error', 'error': validation.messages } )
            return id
        }
        
        this.#swap.getSwapQuote( params, id )
            .then( async( quote ) => {
                const data = await this.#swap.postSwapTransaction( { quote, privateKey, skipConfirmation } )
                return data
            } )
            .then( ( quote ) => {
                this.emit( 'swap', { id, 'eventStatus': 'getQuote', quote } )
                return true
            } )

        return id
    }


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


    connectWebsocket() {
        this.#validateModule( { 'key': 'websocket' } )
        const { status, messages, data } = this.#websocket.connect()
        return { status, messages, data }
    }



    updateWebsocketRoom( { roomId, cmd, type, params={}, strategy=null, filters=[], modifiers=[] } ) {
        this.#validateModule( { 'key': 'websocket' } )
        const { status, messages, data } = this.#websocket.updateRoom( { roomId, cmd, type, params, strategy, filters, modifiers } )
        return { status, messages, data }
    }




    addWebsocketFilter( { funcName, func } ) {
        this.#validateModule( { 'key': 'websocket' } )
        return this.#websocket.addFilter( { funcName, func } )
    }


    addWebsocketModifier( { funcName, func } ) {
        this.#validateModule( { 'key': 'websocket' } )
        return this.#websocket.addModifier( { funcName, func } )
    }

/*
    // Deprecated: Use addWebsocketFilter/addWebsocketModifier with updateWebsocketRoom instead
    addWebsocketStrategy( { name, filters={}, modifiers={} } ) {
        console.warn( 'addWebsocketStrategy is deprecated. Use addWebsocketFilter/addWebsocketModifier with updateWebsocketRoom instead.' )
        this.#validateModule( { 'key': 'websocket' } )
        // addStrategy is commented out in Websocket.mjs, so this won't work anymore
        // const { status, messages, data } = this.#websocket.addStrategy( { name, filters, modifiers } )
        // this.#strictMode( { status, messages, data } )
        return { 'status': false, 'messages': [ 'addStrategy is deprecated - use addFilter/addModifier instead' ], 'data': null }
    }
*/

    health() {
        return true
    }


    #getId() { 
        const { id } = this.#state
        this.#state['id'] += 1
        return { 'id': `${id}` }
    }


    #displayInitialization() {
        const { apiKey, nodeHttp, nodeWs, wsUrl, silent } = this.#state
        
        // Only display if silent mode is disabled
        if( !silent ) {
            const version = '0.1.1'
            
            console.log('┌─ TrackerAPI v' + version + ' ─────────────────────────────────────┐')
            
            // Data Module
            const dataStatus = apiKey !== undefined ? '✅ Data Module      : Active (API Key configured)       ' : '❌ Data Module      : Inactive (No API Key)             '
            console.log('│ ' + dataStatus + '│')
            
            // Swap Module  
            const swapStatus = (nodeHttp !== undefined) ? '✅ Swap Module      : Active (HTTP + WS nodes set)      ' : '❌ Swap Module      : Inactive (No RPC nodes)           '
            console.log('│ ' + swapStatus + '│')
            
            // WebSocket Module
            const wsStatus = wsUrl !== undefined ? '✅ WebSocket Module : Active (WS URL configured)        ' : '❌ WebSocket Module : Inactive (No WS URL)              '
            console.log('│ ' + wsStatus + '│')
            
            // Silent Mode
            const silentStatus = silent ? '✅ Silent Mode      : Enabled                           ' : '⚠️ Silent Mode      : Disabled (set silent: true)       '
            console.log('│ ' + silentStatus + '│')
            
            console.log('└─────────────────────────────────────────────────────────────┘')
        }
    }


    #sendEvent( { event, id, data } ) {
        const payload = { id, ...data }
        this.emit( event, payload )
        return true
    }


    #validateModule( { key } ) {
        const [ , value, initKey ] = [
            [ 'data',      this.#data,      'apiKey'  ],
            [ 'swap',      this.#swap,      'nodeUrl' ],
            [ 'websocket', this.#websocket, 'wsUrl'   ]
        ]
            .find( ( [ k, ] ) => k === key )

        if( value === undefined ) {
            throw new Error( `Module ${key} is not initialized. Missing required parameter: ${initKey}` )
        } 

        return true
    }


    #validateConstructor( { apiKey, nodeHttp, nodeWs, wsUrl, silent } ) {
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

        if( silent !== undefined && typeof silent !== 'boolean' ) {
            messages.push( 'silent must be a boolean' )
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


    #validateBatch( { batch } ) {
        const messages = []
        
        if( !Array.isArray( batch ) ) {
            messages.push( 'batch must be an array' )
        } else if( batch.length === 0 ) {
            messages.push( 'batch cannot be empty' )
        } else {
            batch.forEach( ( item, index ) => {
                if( !item.route ) messages.push( `batch[${index}] missing route` )
                if( !item.params || typeof item.params !== 'object' ) {
                    messages.push( `batch[${index}] params must be an object` )
                }
            } )
        }
        
        return { 'status': messages.length === 0, messages }
    }


    #validateSwapParams( { params } ) {
        const messages = []
        
        if( !params || typeof params !== 'object' ) {
            messages.push( 'params must be an object' )
        } else {
            if( !params.from ) messages.push( 'params.from is required' )
            if( !params.to ) messages.push( 'params.to is required' )  
            if( !params.amount ) messages.push( 'params.amount is required' )
            if( !params.slippage ) messages.push( 'params.slippage is required' )
            if( !params.payer ) messages.push( 'params.payer is required' )
        }
        
        return { 'status': messages.length === 0, messages }
    }


}


export { TrackerAPI, TrackerWebsocket, examples }