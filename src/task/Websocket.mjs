import EventEmitter from 'eventemitter3'


class DataWebsocket {
    #socket


    constructor( { wsUrl } ) {
        this.wsUrl = wsUrl
        this.#socket = null
        this.transactionSocket = null
        this.reconnectAttempts = 0
        this.reconnectDelay = 2500
        this.reconnectDelayMax = 4500
        this.randomizationFactor = 0.5
        this.emitter = new EventEmitter()
        this.subscribedRooms = new Set()
        this.transactions = new Set()
    
        this.connect()
    
/*
        if( typeof window !== 'undefined' ) {
            window.addEventListener( 'beforeunload', this.disconnect.bind( this ) )
        }
*/

        return true
    }
   
    async connect() {
        if( this.#socket && this.transactionSocket ) { return false }
    
        try {
            this.#socket = new WebSocket( this.wsUrl )
            this.transactionSocket = new WebSocket( this.wsUrl )
    
            this.setupSocketListeners( this.#socket, 'main' )
            this.setupSocketListeners( this.transactionSocket, 'transaction' )
        } catch( e ) {
            console.error( 'Error connecting to WebSocket:', e )
            this.reconnect()
        }
        }
   
    setupSocketListeners( socket, type ) {
        socket.onopen = () => {
            console.log( `Connected to ${type} WebSocket server` )
            this.reconnectAttempts = 0
            this.resubscribeToRooms()
            return true
        }
   
        socket.onclose = () => {
            console.log( `Disconnected from ${type} WebSocket server`)
            if( type === 'main' ) { this.#socket = null }
            if( type === 'transaction' ) { this.transactionSocket = null }
            this.reconnect()
            return false
        }
   
        socket.onmessage = ( event ) => {
            try {
                const message = JSON.parse(event.data);
            if( message.type === 'message' ) {
                if( message.data?.tx && this.transactions.has( message.data.tx ) ) {
                    return true
                } else if( message.data?.tx ) {
                    this.transactions.add(message.data.tx);
                }
                if( message.room.includes( 'price:' ) ) {
                    this.emitter.emit( `price-by-token:${message.data.token}`, message.data )
                }
                this.emitter.emit(message.room, message.data);
            }
            } catch( error ) {
                console.error("Error processing message:", error);
            }
        }
    }


    disconnect() {
        if (this.#socket) {
            this.#socket.close()
            this.#socket = null
        }
        if (this.transactionSocket) {
            this.transactionSocket.close()
            this.transactionSocket = null
        }

        this.subscribedRooms.clear()
        this.transactions.clear()
    }


    reconnect() {
        console.log( 'Reconnecting to WebSocket server' )
        const delay = Math.min(
            this.reconnectDelay * Math.pow( 2, this.reconnectAttempts ),
            this.reconnectDelayMax
        );
        const jitter = delay * this.randomizationFactor
        const reconnectDelay = delay + Math.random() * jitter
    
        setTimeout( () => {
            this.reconnectAttempts++
            this.connect()
        }, reconnectDelay )
    }
   

    joinRoom( room ) {
      this.subscribedRooms.add( room )
      const socket = room.includes( 'transaction' )
        ? this.transactionSocket
        : this.#socket
      if( socket && socket.readyState === WebSocket.OPEN ) {
        socket.send( JSON.stringify( { type: 'join', room } ) )
      }
    }
   

    leaveRoom( room ) {
      this.subscribedRooms.delete( room )
      const socket = room.includes( 'transaction' )
        ? this.transactionSocket
        : this.#socket
      if( socket && socket.readyState === WebSocket.OPEN ) {
        socket.send( JSON.stringify( { type: 'leave', room } ) )
      }
    }


    on( room, listener ) {
        this.emitter.on( room, listener )
    }
   

    off( room, listener ) {
        this.emitter.off( room, listener )
    }
   

    getSocket() {
        return this.#socket
    }
   

    resubscribeToRooms() {
        if (
            this.#socket &&
            this.#socket.readyState === WebSocket.OPEN &&
            this.transactionSocket &&
            this.transactionSocket.readyState === WebSocket.OPEN
        ) {
            for( const room of this.subscribedRooms ) {
            const socket = room.includes( 'transaction' )
                ? this.transactionSocket
                : this.#socket;
            socket.send( JSON.stringify( { type: 'join', room } ) )
            }
        }
    }
}


export { DataWebsocket }



