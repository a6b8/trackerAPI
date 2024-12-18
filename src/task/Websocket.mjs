import { Validation } from './Validation.mjs'
import EventEmitter from 'events'
import WebSocket from 'ws'
import { rooms } from '../data/rooms.mjs'
// import { config } from '../data/config.mjs'


class TrackerWebsocket extends EventEmitter {
    #config
    #state
    #sockets
    #emitter
    #validation
    #default


    constructor( { wsUrl, websocket, emitter=null } ) {
        super()

        this.#config = { ...websocket }
        this.#state = {
            wsUrl,
            'reconnectAttempts': 0,
            'subscribedRooms': new Map(),
            'transactions': new Set(),
            'websocketsReady': null,
            'waiting': [],
            'useInternalEmitter': ( emitter === null ) ? true : false
        }

        const { socketNames } = this.#config['websocket']
        this.#state['websocketsReady'] = socketNames
            .reduce( ( acc, socketName ) => {
                acc[ socketName ] = false
                return acc
            }, {} )

        this.#sockets = socketNames
            .reduce( ( acc, socketName ) => {
                acc[ socketName ] = null
                return acc
            }, {} )

        this.#default = {
            'filters': new Map( Object.entries( rooms['default']['filters'] ) ),
            'modifiers': new Map( Object.entries( rooms['default']['modifiers'] ) ),
            'strategies': new Map( Object.entries( rooms['default']['strategies'] ) )
        }

        this.#emitter = emitter
        this.#validation = new Validation()
    }


    connect() {
        const { wsUrl } = this.#state
        const { socketNames } = this.#config['websocket']

        const { messages, status } = this.#validation.connect( { wsUrl } )
        if( !status ) { return { status, messages, 'data': null } }

        if( socketNames.map( ( name ) => this.#sockets[ name ] !== null ).every( a => a ) ) {
            console.log( 'Already connected to WebSocket server' )
            return false
        }

        try {
            socketNames
                .forEach( ( socketName ) => {
                    this.#sockets[ socketName ] = new WebSocket( wsUrl )
                    const currentSocket = this.#sockets[ socketName ]
                    this.#setupSocketListeners( { currentSocket, socketName } )
                } )

        } catch( e ) {
            messages.push( 'Error connecting to WebSocket' )
            console.error( messages.at( -1 ), e )
            this.reconnect()
        }

        return { 'status': true, messages, 'data': { wsUrl } }
    }
   

    disconnect() {
        const { socketNames } = this.#config['websocket']
        socketNames
            .forEach( ( socketName ) => {
                if( this.#sockets[ socketName ] ) {
                    this.#sockets[ socketName ].close()
                    this.#sockets[ socketName ] = null
                }
            } )

        this.#state['subscribedRooms'].clear()
        this.#state['transactions'].clear()

        return true
    }


    reconnect() {
        console.log( 'Reconnecting to WebSocket server' )
        const { reconnectAttempts, wsUrl } = this.#state
        const { reconnectDelay, reconnectDelayMax, randomizationFactor } = this.#config['websocket']

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
   

    updateRoom( { roomId, cmd, params={}, strategy=null } ) {
        const strategies = [ ...this.#default['strategies'].keys() ]
        const { messages, status } = this.#validation.updateRoom( { roomId, cmd, params, strategy, strategies } )
        if( !status ) { return { 'status': false, messages, 'data': null } }

        const { struct, variables, socketName } = rooms['rooms'][ roomId ]
        if( !this.#state['websocketsReady'][ socketName ] ) {
            console.log( `.updateRoom()\t Socket "${socketName}" Room "${roomId}" is waiting for connection` )
            this.#state['waiting'].push( { roomId, cmd, params, strategy } )
            return { 'status': true, messages, 'data': null }
        }

        try {
            const room = variables
                .reduce( ( acc, [ k, ] ) => {
                    acc = acc.replace( `{{${k}}}`, params[ k ] )
                    return acc
                }, struct )
            const payload = { 'type': cmd, room }
            this.#sockets[ socketName ].send( JSON.stringify( payload ) )

            if( cmd === 'join' ) {
                const obj = { roomId, params, 'status': 'waiting', 'count': 0, strategy }
                this.#state['subscribedRooms'].set( room, obj )
            } else if( cmd === 'leave' ) {
                this.#state['subscribedRooms'].delete( room )
            }
        } catch( e ) {
            console.error( 'Error updating room:', e )
            return { 'status': false, messages: [ 'Error updating room' ], 'data': null }
        }

        return { status, messages, 'data': null }
    }


    addStrategy( { name, filters={}, modifiers={} } ) {
        const { messages, status } = this.#validation.addStrategy( { name, filters, modifiers, '_default': this.#default } )
        if( !status ) { return { status, messages, 'data': null } }

        if( this.#default['strategies'].has( name ) ) {
            console.log( `.addStrategy()\t Strategy "${name}" already exists` )
            return false
        }

        const keys =  [
            [ 'filters', filters ],
            [ 'modifiers', modifiers ]
        ]

        keys
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

        const values = keys
            .reduce( ( acc, [ k, v ], index ) => {
                acc[ k ] = Object.keys( v )
                return acc
            }, {} )
        this.#default['strategies'].set( name, values )

        return { status, messages, 'data': null }
    }


    #setupSocketListeners( { currentSocket, socketName } ) {
        currentSocket.onopen = () => {
            console.log( `.connect()\tSocket "${socketName}" establish connection` )
            // console.log( `Connected to ${socketName} WebSocket server` )
            // this.#state['reconnectAttempts'] = 0
            // this.#resubscribeToRooms()
            return true
        }
   
        currentSocket.onclose = () => {
            console.log( `.connect()\tSocket "${socketName}" disconnect` )
            // console.log( `Disconnected from ${socketName} WebSocket server`)
            this.#sockets['main'][ socketName ] = null
            this.reconnect()
            return false
        }
   
        currentSocket.onmessage = ( event ) => {
            try {
                const message = JSON.parse( event.data )
                this.#centralRouter( { message, socketName } )
            } catch( error ) {
                console.error( 'Error processing message:', error )
            }
        }
    }


    #centralRouter( { message, socketName } ) {
        const { type } = message
        switch( type ) {
            case 'ping':
                this.#pingRouter( { socketName } )
                break
            case 'joined':
                this.#joinedRouter( { message, socketName } )
                break
            case 'left':
                break
            case 'message':
                this.#messageRouter( { message, socketName } )
                break
            default:
                console.log( `Unknown message type: ${type}` )
                break
        }

        return true
    }


    #pingRouter( { socketName } ) {
        if( !this.#state['websocketsReady'][ socketName ] ) {
            this.#state['websocketsReady'][ socketName ] = true
            console.log( `.connect()\tSocket "${socketName}" is ready` )
        }

        if( 
            Object.values( this.#state['websocketsReady'] ).every( ( v ) => v ) &&
            this.#state['waiting'].length > 0 
        ) {
            this.#state['waiting']
                .forEach( ( { roomId, cmd, params, strategy } ) => {
                    this.updateRoom( { roomId, cmd, params, strategy } )
                } )
            this.#state['waiting'] = []
        }

        return true
    }


    #joinedRouter( { message, socketName } ) {
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


        console.log( `.updateRoom()\tSocket "${socketName}", Room "${room}" is active.` )
        return true
    }


    #messageRouter( { message, socketName } ) {
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
            this.#emitter( eventName, data )
        }

        return true
    }
}


export { TrackerWebsocket }