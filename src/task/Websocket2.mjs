import EventEmitter from 'events'
import WebSocket from 'ws'
import { rooms } from '../data/rooms.mjs'


class DataWebsocket extends EventEmitter {
    #config
    #state
    #sockets
    #emitter


    constructor( { wsUrl } ) {
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
            'waiting': []
        }

        this.#sockets = {
            'main': null,
            'transaction': null
        }

        this.#emitter = new EventEmitter()    
        this.connect( { wsUrl } )
    }


    async connect( { wsUrl } ) {
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
   

    updateRoom( { roomId, type='join', params={} } ) {
        console.log( 'updateRoom', roomId, type, params )

        if( this.#state['websocketsReady'].every( ( v ) => !v ) ) {
            this.#state['waiting'].push( { roomId, type, params } )
            return false
        }

        const { isTransaction, struct, variables } = rooms['rooms'][ roomId ]
        const room = variables
            .reduce( ( acc, [ k, ] ) => {
                acc = acc.replace( `{{${k}}}`, params[ k ] )
                return acc
            }, struct )

        if( type === 'join' ) {
            console.log( 'join', this.#state )
            this.#state['subscribedRooms'].set( 
                room, 
                { roomId, params, 'status': 'waiting' } 
            )
        } else if( type === 'leave' ) {
            this.#state['subscribedRooms'].delete( room )
        } else {
            throw new Error( 'Invalid type' )
        }

        const socketKey = isTransaction ? 'transaction' : 'main'
        if( this.#sockets[ socketKey ] && 
            this.#sockets[ socketKey ].readyState === WebSocket.OPEN 
        ) {
            const payload = { type, room }
            this.#sockets[ socketKey ].send( JSON.stringify( payload ) )
        }

        return true
    }
/*
    joinRoom( room ) {
      this.#state['subscribedRooms'].add( room )
      const socket = room.includes( 'transaction' )
        ? this.#sockets['transaction']
        : this.#sockets['main']
      if( socket && socket.readyState === WebSocket.OPEN ) {
        socket.send( JSON.stringify( { type: 'join', room } ) )
      }
    }
   

    leaveRoom( room ) {
      this.#state['subscribedRooms'].delete( room )
      const socket = room.includes( 'transaction' )
        ? this.#sockets['transaction']
        : this.#sockets['main']
      if( socket && socket.readyState === WebSocket.OPEN ) {
        socket.send( JSON.stringify( { type: 'leave', room } ) )
      }
    }
*/

/*
    on( room, listener ) {
        this.#emitter.on( room, listener )
    }
   

    off( room, listener ) {
        this.#emitter.off( room, listener )
    }
   

    getSocket() {
        return this.#sockets['main']
    }
*/

    #setupSocketListeners( socket, type ) {
        socket.onopen = () => {
            console.log( `Connected to ${type} WebSocket server` )
            this.#state['reconnectAttempts'] = 0
            this.#resubscribeToRooms()
            return true
        }
   
        socket.onclose = () => {
            console.log( `Disconnected from ${type} WebSocket server`)
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
        console.log( 'message', message )
        const { type: _type } = message
        switch( _type ) {
            case 'ping':
                this.#pingRouter( { type } )
                break
            case 'joined':
                this.#joinedRouter( { message } )
                break
            case 'message':
                // console.log( 'message' )
                this.#messageRouter( { message } )
                break
            default:
                console.log( '>>>', message)
                break
        }

        return true
    }


    #pingRouter( { type } ) {
        if( !Object.values( this.#state['websocketsReady'] ).every( ( v ) => v ) ) {
            const index = type === 'main' ? 0 : 1
            this.#state['websocketsReady'][ index ] = true
            console.log( 'pingRouter', this.#state['websocketsReady'] )
        }

        if( this.#state['waiting'].length > 0 ) {
            this.#state['waiting']
                .forEach( ( { roomId, type, params } ) => {
                    this.updateRoom( { roomId, type, params } )
                } )
            this.#state['waiting'] = []
        }

        return true
    }


    #joinedRouter( { message } ) {
        const { type, room } = message
        const current = this.#state['subscribedRooms'].get( room )
        if( !current ) { return false }
        current.status = 'active'
        this.#state['subscribedRooms'].set( room, current )

        console.log( `Joined room: ${room}` )
        return true
    }


    #messageRouter( { message } ) {
        const { data, room } = message
        console.log( 'messageRouter', message )
        const current = this.#state['subscribedRooms'].get( room )
        console.log( 'current', current )

        process.exit( 1 )
    }
    

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
}


export { DataWebsocket }