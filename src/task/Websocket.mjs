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
    #lastLog
    #repeatCount


    constructor( { wsUrl, websocket, emitter=null, silent=false } ) {
        super()

        this.#config = { ...websocket }
        this.#state = {
            wsUrl,
            silent,
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
    this.#lastLog = null
    this.#repeatCount = 0
    // Diagnostics / Metrics
    this.#state['metrics'] = {
        'opens': {},            // socketName -> timestamp
        'immediateCloses': {},  // socketName -> count
        'lastAggregate': 0,     // timestamp
        'attemptsPerSocket': {} // socketName -> count
    }
    }

    /**
     * Internal helper function for consistent error messages
     */
    #log( level, msg, extra={} ) {
        const ts = new Date().toISOString().split( 'T' )[ 1 ].replace( 'Z', '' )
        const flat = Object.entries( extra )
            .filter( ( [ , v ] ) => v !== undefined && v !== null )
            .map( ( [ k, v ] ) => `${k}=${v}` )
            .join( ' ' )
        const line = `[WS][${level.toUpperCase()}] ${msg}${ flat ? ' | ' + flat : '' }`

        // spam suppression (collapse identical consecutive lines within 1200ms)
        const now = Date.now()
        const signature = `${level}|${msg}|${flat}`
        if( this.#lastLog && this.#lastLog.signature === signature && ( now - this.#lastLog.time ) < 1200 ) {
            this.#repeatCount++
            this.#lastLog.time = now
            return
        }
        if( this.#repeatCount > 0 && ( !this.#state.silent || this.#lastLog.level === 'error' ) ) {
            // eslint-disable-next-line no-console
            console[ this.#lastLog.level ]( `[WS][${this.#lastLog.level.toUpperCase()}] (repeated x${this.#repeatCount + 1}) ${this.#lastLog.msg}` )
            this.#repeatCount = 0
        }
        // Only log if not in silent mode or if it's an error
        if( !this.#state.silent || level === 'error' ) {
            // eslint-disable-next-line no-console
            console[ level ]( line )
        }
        this.#lastLog = { signature, time: now, level, msg }
        if( this.#emitter && typeof this.#emitter === 'function' ) {
            try { this.#emitter( 'websocketLog', { level, msg, extra } ) } catch( _ ) {}
        } else if( this.emit ) {
            this.emit( 'websocketLog', { level, msg, extra } )
        }
    }


    connect() {
        const { wsUrl } = this.#state
        const { socketNames } = this.#config['websocket']

        const { messages, status } = this.#validation.connect( { wsUrl } )
        if( !status ) { return { status, messages, 'data': null } }

    // Only initialize sockets that don't exist yet
    const pending = socketNames.filter( ( name ) => this.#sockets[ name ] === null )
    if( pending.length === 0 ) { return { 'status': true, 'messages': [ 'already-connected' ], 'data': { wsUrl } } }

        try {
            pending.forEach( ( socketName ) => {
                this.#sockets[ socketName ] = new WebSocket( wsUrl )
                const currentSocket = this.#sockets[ socketName ]
                this.#setupSocketListeners( { currentSocket, socketName } )
                this.#log( 'info', 'Connection attempt', { socketName, wsUrl } )
                this.#state['metrics']['attemptsPerSocket'][ socketName ] = ( this.#state['metrics']['attemptsPerSocket'][ socketName ] || 0 ) + 1
            } )

        } catch( e ) {
            messages.push( 'Error connecting to WebSocket' )
            this.#log( 'error', 'Error establishing connection', { wsUrl, error: e?.message } )
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
    const { reconnectAttempts, wsUrl } = this.#state
        const { websocket } = this.#config
        const maxReconnectAttempts = websocket?.maxReconnectAttempts ?? 0 // 0 => unendlich

        if( maxReconnectAttempts > 0 && reconnectAttempts >= maxReconnectAttempts ) {
            this.#log( 'error', 'Maximum reconnect attempts reached - aborting', { reconnectAttempts, wsUrl } )
            return false
        }

        // First additional immediate retry attempt
        if( reconnectAttempts === 0 ) {
            this.#log( 'warn', 'First connection attempt failed - starting IMMEDIATE additional retry', { wsUrl } )
            this.#state['reconnectAttempts']++
            this.connect( { wsUrl } )
            return true
        }

    this.#log( 'info', 'Reconnecting (exponential backoff)', { reconnectAttempts, wsUrl } )
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
   

    updateRoom( { roomId, cmd, type, params={}, strategy=null, filters=[], modifiers=[] } ) {
        // Support both old 'cmd' and new 'type' parameter
        const command = type || cmd
        
        // For backward compatibility with strategies
        if( strategy ) {
            const strategies = [ ...this.#default['strategies'].keys() ]
            const { messages, status } = this.#validation.updateRoom( { roomId, 'cmd': command, params, strategy, strategies } )
            if( !status ) { return { 'status': false, messages, 'data': null } }
        }

        const { struct, variables, socketName } = rooms['rooms'][ roomId ]
        if( !this.#state['websocketsReady'][ socketName ] ) {
            if( !this.#state.silent ) console.log( `.updateRoom()\t Socket "${socketName}" Room "${roomId}" is waiting for connection` )
            this.#state['waiting'].push( { roomId, 'cmd': command, params, strategy, filters, modifiers } )
            return { 'status': true, 'messages': [], 'data': null }
        }

        try {
            const room = variables
                .reduce( ( acc, [ k, ] ) => {
                    acc = acc.replace( `{{${k}}}`, params[ k ] )
                    return acc
                }, struct )
            const payload = { 'type': command, room }
            this.#sockets[ socketName ].send( JSON.stringify( payload ) )

            if( command === 'join' ) {
                const obj = { roomId, params, 'status': 'waiting', 'count': 0, strategy, filters, modifiers }
                this.#state['subscribedRooms'].set( room, obj )
            } else if( command === 'leave' ) {
                this.#state['subscribedRooms'].delete( room )
            }
        } catch( e ) {
            if( !this.#state.silent ) console.error( 'Error updating room:', e )
            return { 'status': false, 'messages': [ 'Error updating room' ], 'data': null }
        }

        return { 'status': true, 'messages': [], 'data': null }
    }


    // New method: addFilter returns an object for use in updateRoom
    addFilter( { funcName, func } ) {
        if( !funcName || typeof func !== 'function' ) {
            if( !this.#state.silent ) console.error( 'addFilter requires funcName and func parameters' )
            return null
        }
        
        return { funcName, func, 'type': 'filter' }
    }


    // New method: addModifier returns an object for use in updateRoom
    addModifier( { funcName, func } ) {
        if( !funcName || typeof func !== 'function' ) {
            if( !this.#state.silent ) console.error( 'addModifier requires funcName and func parameters' )
            return null
        }
        
        return { funcName, func, 'type': 'modifier' }
    }


    #setupSocketListeners( { currentSocket, socketName } ) {
        currentSocket.onopen = () => {
            this.#log( 'info', `.connect() Socket "${socketName}" connection established`, { socketName } )
            this.#state['metrics']['opens'][ socketName ] = Date.now()
            return true
        }
   
        currentSocket.onclose = ( event ) => {
            const { code, reason } = event || {}
            const openedAt = this.#state['metrics']['opens'][ socketName ] || 0
            const lifetimeMs = openedAt ? Date.now() - openedAt : -1
            const immediate = lifetimeMs >= 0 && lifetimeMs < 800
            if( immediate ) {
                this.#state['metrics']['immediateCloses'][ socketName ] = ( this.#state['metrics']['immediateCloses'][ socketName ] || 0 ) + 1
            }
            const mapped = this.#mapCloseCode( code )
            this.#log( immediate ? 'error' : 'warn', 'Socket disconnected', { socketName, wsUrl: this.#state.wsUrl, code, mapped, reason: ( reason || '' ).toString(), lifetimeMs } )
            this.#maybeAggregate()
            this.#sockets[ socketName ] = null
            this.reconnect()
            return false
        }
   
        currentSocket.onerror = ( error ) => {
            this.#log( 'error', 'Socket error', { socketName, message: error?.message } )
        }

        currentSocket.onmessage = ( event ) => {
            try {
                const message = JSON.parse( event.data )
                this.#centralRouter( { message, socketName } )
            } catch( error ) {
                this.#log( 'error', 'Error processing message', { socketName, error: error?.message } )
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
                if( !this.#state.silent ) console.log( `Unknown message type: ${type}` )
                break
        }

        return true
    }


    #pingRouter( { socketName } ) {
        if( !this.#state['websocketsReady'][ socketName ] ) {
            this.#state['websocketsReady'][ socketName ] = true
            this.#log( 'info', 'Socket is ready', { socketName } )
            // Reset attempts after successful initialization
            this.#state['reconnectAttempts'] = 0
        }

        if( 
            Object.values( this.#state['websocketsReady'] ).every( ( v ) => v ) &&
            this.#state['waiting'].length > 0 
        ) {
            this.#state['waiting']
                .forEach( ( { roomId, cmd, params, strategy, filters, modifiers } ) => {
                    this.updateRoom( { roomId, cmd, params, strategy, filters, modifiers } )
                } )
            this.#state['waiting'] = []
        }

        return true
    }

    // Map WebSocket close codes to descriptive reasons
    #mapCloseCode( code ) {
        const table = {
            1000: 'Normal Closure',
            1001: 'Going Away',
            1002: 'Protocol Error',
            1003: 'Unsupported Data',
            1005: 'No Status Received',
            1006: 'Abnormal Closure (No Close Frame)',
            1007: 'Inconsistent Data',
            1008: 'Policy Violation (Auth/Permission?)',
            1009: 'Message Too Big',
            1010: 'Missing Extension',
            1011: 'Internal Server Error',
            1012: 'Service Restart',
            1013: 'Try Again Later / Overloaded',
            1014: 'Bad Gateway (Upstream)',
            1015: 'TLS Handshake Failure'
        }
        return table[ code ] || 'Unknown Code'
    }

    // Periodic aggregation of diagnostics
    #maybeAggregate() {
        const now = Date.now()
        const metrics = this.#state['metrics']
        if( now - metrics['lastAggregate'] < 5000 ) { return }
        metrics['lastAggregate'] = now
        const { immediateCloses, attemptsPerSocket } = metrics
        const summary = Object
            .keys( attemptsPerSocket )
            .map( s => `${s}: attempts=${attemptsPerSocket[ s ]}, immediateCloses=${ immediateCloses[ s ] || 0 }` )
            .join( ' | ' )
        this.#log( 'info', 'Aggregate status', { summary } )
        const totalImmediate = Object.values( immediateCloses ).reduce( ( a, b ) => a + b, 0 )
        if( totalImmediate > 10 ) {
            this.#log( 'error', 'High number of immediate closes – check wsUrl / auth / network / server policy', { totalImmediate } )
        }
    }


    #joinedRouter( { message, socketName } ) {
        const { room } = message
        const current = this.#state['subscribedRooms'].get( room )
        if( !current ) { 
            if( !this.#state.silent ) console.log( `Room not found: ${room} 2` )
            return false 
        }
        const { roomId } = current
        current['status'] = 'active'
        this.#state['subscribedRooms'].set( room, current )
        // this.#print[ roomId ][ room ]['status'] = 'active'


        if( !this.#state.silent ) console.log( `.updateRoom()\tSocket "${socketName}", Room "${room}" is active.` )
        return true
    }


    #messageRouter( { message, socketName } ) {
        const { data, room } = message
        const current = this.#state['subscribedRooms'].get( room )

        if( !current ) { 
            if( !this.#state.silent ) console.log( `Room not found: ${room} 1` )
            return false 
        }
        this.#state['subscribedRooms'].get( room ).count++
        const { roomId, strategy, filters: roomFilters = [], modifiers: roomModifiers = [] } = current
        
        // If using new filter/modifier arrays
        if( roomFilters.length > 0 || roomModifiers.length > 0 ) {
            // Apply filters
            const isFiltered = roomFilters
                .map( ( filterObj ) => filterObj.func( data ) )
                .every( ( v ) => v )
            if( !isFiltered ) { return false }
            
            // Apply modifiers
            const result = roomModifiers
                .reduce( ( acc, modifierObj ) => modifierObj.func( acc ), data )
            this.#sendEvent( { 'eventName': roomId, 'data': result } )
            return true
        }
        
        // Legacy strategy support
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
        
        return true
    }

    #printStatus() {
        const all = Array
            .from( this.#state['subscribedRooms'].entries() )
            .reduce( ( acc, [ room, value ] ) => {
                const { count } = value
                acc.push( [ room, count ] )
                return acc
            }, [] )

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


// Export both TrackerWebsocket and DataWebsocket (alias for backward compatibility)
export { TrackerWebsocket, TrackerWebsocket as DataWebsocket }