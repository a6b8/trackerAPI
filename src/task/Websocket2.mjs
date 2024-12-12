import { Validation } from './Validation.mjs'
import EventEmitter from 'events'
import WebSocket from 'ws'
import { rooms } from '../data/rooms.mjs'


class DataWebsocket extends EventEmitter {
    #config
    #state
    #sockets
    #emitter
    #filters
    #modifiers
    #validation
    #default

    constructor( { wsUrl, emitter=null } ) {
        super()
        this.#config = { 
            'reconnectDelay': 2500,
            'reconnectDelayMax': 4500,
            'randomizationFactor': 0.5
        }

        this.#state = {
            wsUrl,
            'reconnectAttempts': 0,
            'subscribedRooms': new Map(),
            'transactions': new Set(),
            'websocketsReady': [ false, false ],
            'waiting': [],
            'useInternalEmitter': ( emitter === null ) ? true : false
        }

        this.#default = {
            'filters': new Map( Object.entries( rooms['default']['filters'] ) ),
            'modifiers': new Map( Object.entries( rooms['default']['modifiers'] ) ),
            'strategies': new Map( Object.entries( rooms['default']['strategies'] ) )
        }

        this.#sockets = {
            'main': null,
            'transaction': null
        }

        this.#emitter = emitter
        this.#validation = new Validation()

        this.#filters = new Map()
        this.#modifiers = new Map()

        this.connect( { wsUrl } )
    }


    async connect( { wsUrl } ) {
        const { messages, status } = this.#validation.connect( { wsUrl } )
        if( !status ) { return { 'status': false, messages, 'data': null } }

        if( this.#sockets['main'] && this.#sockets['transaction'] ) { return false }
    
        try {
            this.#sockets['main'] = new WebSocket( wsUrl )
            this.#sockets['transaction'] = new WebSocket( wsUrl )
    
            this.#setupSocketListeners( this.#sockets['main'], 'main' )
            this.#setupSocketListeners( this.#sockets['transaction'], 'transaction' )
        } catch( e ) {
            console.error( 'Error connecting to WebSocket:', e )
            this.reconnect()
        }

        return true
    }
   

    disconnect() {
        if( this.#sockets['main'] ) {
            this.#sockets['main'].close()
            this.#sockets['main'] = null
        }
        if( this.#sockets['transaction'] ) {
            this.#sockets['transaction'].close()
            this.#sockets['transaction'] = null
        }

        this.#state['subscribedRooms'].clear()
        this.#state['transactions'].clear()

        return true
    }


    reconnect() {
        console.log( 'Reconnecting to WebSocket server' )
        const { reconnectAttempts, wsUrl } = this.#state
        const { reconnectDelay, reconnectDelayMax, randomizationFactor } = this.#config

        const delay = Math.min(
            reconnectDelay * Math.pow( 2, reconnectAttempts ),
            reconnectDelayMax
        )
        const jitter = delay * randomizationFactor
        const _reconnectDelay = delay + Math.random() * jitter
    
        setTimeout( () => {
            this.#state['reconnectAttempts']++
            this.connect( { wsUrl } )
        }, _reconnectDelay )

        return true
    }
   

    updateRoom( { roomId, type, params={}, strategy=null } ) {
        const strategies = [ ...this.#default['strategies'].keys() ]
        const { messages, status } = this.#validation.updateRoom( { roomId, type, params, strategy, strategies } )
        if( !status ) { return { 'status': false, messages, 'data': null } }

        const { isTransaction, struct, variables } = rooms['rooms'][ roomId ]
        const socketKey = isTransaction ? 'transaction' : 'main'
        const socketIndex = isTransaction ? 1 : 0

        if( !this.#state['websocketsReady'][ socketIndex ] ) {
            console.log( `.updateRoom()\t Socket "${socketKey}" Room "${roomId}" is waiting for connection` )
            this.#state['waiting'].push( { roomId, type, params, strategy } )
            return false
        }

        try {
            const room = variables
                .reduce( ( acc, [ k, ] ) => {
                    acc = acc.replace( `{{${k}}}`, params[ k ] )
                    return acc
                }, struct )
            const payload = { type, room }
            this.#sockets[ socketKey ].send( JSON.stringify( payload ) )
    
            if( type === 'join' ) {
                const obj = { roomId, params, 'status': 'waiting', 'count': 0, strategy }
                this.#state['subscribedRooms'].set( room, obj )
            } else if( type === 'leave' ) {
                this.#state['subscribedRooms'].delete( room )
            }
        } catch( e ) {
            console.error( 'Error updating room:', e )
            return false
        }

        return true
    }


    addStrategy( { name, struct } ) {
        const { messages, status } = this.#validation.addStrategy( { name, struct, '_default': this.#default } )
        if( !status ) { return { 'status': false, messages, 'data': null } }

        if( this.#default['strategies'].has( name ) ) {
            console.log( `.addStrategy()\t Strategy "${name}" already exists` )
            return false
        }

        Object
            .entries( struct )
            .forEach( ( [ key, values ] ) => {   
                Object
                    .entries( values )
                    .forEach( ( [ k, v ] ) => {
                        if( v === null ) { return true }
                        if( this.#default[ key ].has( v ) ) {
                            console.log( `.addStrategy()\t ${key} "${v}" not found` )
                            return false
                        }
                        this.#default[ key ].set( k, v )
                        return true
                    } )
            } )

        const values = Object
            .entries( struct )
            .reduce( ( acc, [ k, v ], index ) => {
                acc[ k ] = Object.keys( v )
                return acc
            }, {} )
        this.#default['strategies'].set( name, values )

        return true
    }


/*
    #addFilter( { name, func } ) {
        if( this.#filters.has( name ) ) { 
            console.log( `.addFilter()\t Function "${name}" already exists` )
            return false 
        } else {
            console.log( `.addFilter()\t Function "${name}" added` )
            this.#filters.set( name, func )
        }

        return true
    }


    #addModifier( { name, func } ) {
        if( this.#modifiers.has( name ) ) { 
            console.log( `.addModifier()\t Function "${name}" already exists` )
            return false 
        } else {
            console.log( `.addModifier()\t Function "${name}" added` )
            this.#modifiers.set( name, func )
        }

        return true
    }
*/

    #setupSocketListeners( socket, type ) {
        socket.onopen = () => {
            console.log( `.connect()\tSocket "${type}" establish connection` )
            // console.log( `Connected to ${type} WebSocket server` )
            // this.#state['reconnectAttempts'] = 0
            // this.#resubscribeToRooms()
            return true
        }
   
        socket.onclose = () => {
            console.log( `.connect()\tSocket "${type}" disconnect` )
            // console.log( `Disconnected from ${type} WebSocket server`)
            if( type === 'main' ) { this.#sockets['main'] = null }
            if( type === 'transaction' ) { this.#sockets['transaction'] = null }
            this.reconnect()
            return false
        }
   
        socket.onmessage = ( event ) => {
            try {
                const message = JSON.parse( event.data )
                this.#centralRouter( { message, type } )
            } catch( error ) {
                console.error( 'Error processing message:', error )
            }
        }
    }


    #centralRouter( { message, type } ) {
        const { type: _type } = message
        switch( _type ) {
            case 'ping':
                this.#pingRouter( { type } )
                break
            case 'joined':
                this.#joinedRouter( { message, type } )
                break
            case 'message':
                this.#messageRouter( { message, type } )
                break
            default:
                console.log( '>>>', message )
                break
        }

        return true
    }


    #pingRouter( { type } ) {
        if( !Object.values( this.#state['websocketsReady'] ).every( ( v ) => v ) ) {
            const index = type === 'main' ? 0 : 1
            this.#state['websocketsReady'][ index ] = true
            console.log( `.connect()\tSocket "${type}" is ready` )
        }

        if( 
            Object.values( this.#state['websocketsReady'] ).every( ( v ) => v ) &&
            this.#state['waiting'].length > 0 
        ) {
            this.#state['waiting']
                .forEach( ( { roomId, type, params, strategy } ) => {
                    this.updateRoom( { roomId, type, params, strategy } )
                } )
            this.#state['waiting'] = []
        }

        return true
    }


    #joinedRouter( { message, type } ) {
        const { room } = message
        const current = this.#state['subscribedRooms'].get( room )
        if( !current ) { 
            console.log( `Room not found: ${room} 2` )
            return false 
        }
        const { roomId } = current
        current['status'] = 'active'
        this.#state['subscribedRooms'].set( room, current )
        // this.#print[ roomId ][ room ]['status'] = 'active'


        console.log( `.updateRoom()\tSocket "${type}", Room "${room}" is active.` )
        return true
    }


    #messageRouter( { message, type } ) {
        const { data, room } = message
        const current = this.#state['subscribedRooms'].get( room )

        if( !current ) { 
            console.log( `Room not found: ${room} 1` )
            return false 
        }
        this.#state['subscribedRooms'].get( room ).count++
        const { roomId, strategy } = current
        if( strategy === null ) {
            this.#sendEvent( { 'eventName': roomId, data } )
            return true
        }

        const { filters, modifiers } = this.#default['strategies'].get( strategy )
        const isFiltered = filters
            .map( ( name ) => {
                const { func } = this.#default['filters'].get( name )
                return func( data )
            } )
            .every( ( v ) => v )
        if( !isFiltered ) { return false }

        const result = modifiers
            .reduce( ( acc, name ) => {
                const { func } = this.#default['modifiers'].get( name )
                acc = func( acc )
                return acc
            }, data )
        this.#sendEvent( { 'eventName': roomId, 'data': result } )
        
        // this.#printStatus()
        return true
    }
    
/*
    #resubscribeToRooms() {
        if (
            this.#sockets['main'] &&
            this.#sockets['main'].readyState === WebSocket.OPEN &&
            this.#sockets['transaction'] &&
            this.#sockets['transaction'].readyState === WebSocket.OPEN
        ) {
            this.#state['subscribedRooms']
                .entries( ( [ room, value ] ) => { 
                    const { roomId, params } = value
                    this.updateRoom( { roomId, type: 'join', params } ) 
                } )
        }
    }
*/

    #printStatus() {
        const all = Array
            .from( this.#state['subscribedRooms'].entries() )
            .reduce( ( acc, [ room, value ] ) => {
                const { count } = value
                acc.push( [ room, count ] )
                return acc
            }, [] )
        // console.log( '>>>', all )

        return true
    }


    #sendEvent( { eventName, data } ) {
        if( this.#state['useInternalEmitter'] ) {
            this.emit( eventName, data )
        } else {
            this.#emitter.emit( eventName, data )
        }

        return true
    }

}


export { DataWebsocket }