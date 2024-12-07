import EventEmitter from 'eventemitter3'
import WebSocket from 'ws'

class DataWebsocket {
    #config
    #state
    #sockets


    constructor( { wsUrl } ) {
        this.#sockets['main'] = null
        this.#sockets['transaction'] = null

        this.#config = { 
            'reconnectDelay': 2500,
            'reconnectDelayMax': 4500,
            'randomizationFactor': 0.5
        }

        this.#state = {
            'reconnectAttempts': 0,
            'subscribedRooms': new Set(),
            'transactions': new Set()
        }

        this.#sockets = {
            'main': null,
            'transaction': null
        }

        this.emitter = new EventEmitter()
        this.#state['subscribedRooms'] = new Set()
        this.#state['transactions'] = new Set()
    
        this.connect( { wsUrl } )

        return true
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
        const { reconnectAttempts } = this.#state
        const { reconnectDelay, reconnectDelayMax, randomizationFactor } = this.#config

        const delay = Math.min(
            reconnectDelay * Math.pow( 2, reconnectAttempts ),
            reconnectDelayMax
        )
        const jitter = delay * randomizationFactor
        const _reconnectDelay = delay + Math.random() * jitter
    
        setTimeout( () => {
            this.#state['reconnectAttempts']++
            this.connect()
        }, _reconnectDelay )

        return true
    }
   

    updateRoom( { room, type } ) {
        if( type === 'join' ) {
            this.#state['subscribedRooms'].add( room )
        } else if( type === 'leave' ) {
            this.#state['subscribedRooms'].delete( room )
        } else {
            throw new Error( 'Invalid type' )
        }

        let socket
        if( room.includes( 'transaction' ) ) {
            socket = this.#sockets['transaction']
        } else {
            socket = this.#sockets['main']
        }

        if( socket && socket.readyState === WebSocket.OPEN ) {
            socket.send( JSON.stringify( { type, room } ) )
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
        this.emitter.on( room, listener )
    }
   

    off( room, listener ) {
        this.emitter.off( room, listener )
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
                if( message.type === 'message' ) {
                    if( message.data?.tx && this.#state['transactions'].has( message.data.tx ) ) {
                        return true
                    } else if( message.data?.tx ) {
                        this.#state['transactions'].add(message.data.tx);
                    }
                    if( message.room.includes( 'price:' ) ) {
                        this.emitter.emit( `price-by-token:${message.data.token}`, message.data )
                    }
                    this.emitter.emit(message.room, message.data);
                }
            } catch( error ) {
                console.error( 'Error processing message:', error )
            }
        }
    }
   

    #resubscribeToRooms() {
        if (
            this.#sockets['main'] &&
            this.#sockets['main'].readyState === WebSocket.OPEN &&
            this.#sockets['transaction'] &&
            this.#sockets['transaction'].readyState === WebSocket.OPEN
        ) {
            this.#state['subscribedRooms']
                .forEach( ( room ) => { 
                    this.updateRoom( { room, type: 'join' } ) 
                } )
        }
    }
}


export { DataWebsocket }