import { endpoints } from '../data/endpoints.mjs'
import { rooms } from '../data/rooms.mjs'
import { swap } from '../data/swap.mjs'


class Validation {
    #config
    #validMethods


    constructor() {
        this.#config = { endpoints, swap }
        this.#validMethods = Object.keys( this.#config.endpoints )
    }


    getData( { route, params } ) {
        const m = []
        const s = []

        {
            const { messages, status } = this.#validateMethod( { route } )
            m.push( ...messages )
            s.push( status )
        }

        {
            const { messages, status } = this.#validateParams( { route, params } )
            m.push( ...messages )
            s.push( status )
        }

        const status = s.every( status => status === true )
        const result = { 'messages': m, status }

        return result
    }


    getSwapQuote( params ) {
        const { messages, status } = this.#validateGetSwapQuote( params )
        return { messages, status }
    }


    postSwap( { quote, privateKey, skipConfirmation } ) {
        const { messages, status } = this.#validatePostSwap( { quote, privateKey, skipConfirmation } )
        return { messages, status }
    }


    updateRoom( { roomId, type, params={} } ) {
        const { message, status } = this.#validateUpdateRoom( { roomId, type, params } )
        return { message, status }
    } 


    connect( { wsUrl } ) {
        const { messages, status } = this.#validateConnect( { wsUrl } )
        return { messages, status }
    }


    #validateGetSwapQuote( params ) {
        const messages = []

        if( params === undefined ) {
            messages.push( `Params is undefined` )
        }

        if( typeof params !== 'object' ) {
            messages.push( `Params is not an object` )
        }

        if( messages.length === 0 ) {
            return { messages, status: true }
        }

        Object
            .entries( this.#config['swap'] )
            .forEach( ( [ key, values ] ) => {
                const { required } = values
                if( required && !params[ key ] ) {
                    messages.push( `Missing parameter: ${key} (required)` )
                }
            } )

        Object
            .entries( params )
            .forEach( ( [ key, value ] ) => {
                if( !this.#config['swap'][ key ] ) {
                    const suggestion = this.#findClosestString( { input: key, keys: Object.keys( this.#config['swap'] ) } )
                    messages.push( `Invalid parameter: ${key}. Did you mean '${suggestion}'?` )
                }
            } )

        const status = messages.length === 0 ? true : false
        return { messages, status }
    }


    #validatePostSwap( { quote, privateKey, skipConfirmation } ) {
        const messages = []

        if( quote === undefined ) {
            messages.push( `Quote is undefined` )
        } else if( typeof quote !== 'object' ) {
            messages.push( `Quote is not an object` )
        } else {
            const test = [
                [ 'status', 'boolean' ],
                [ 'data',   'object'  ]
            ]
                .forEach( ( [ key, type ] ) => { 
                    if( quote[ key ] === undefined ) {
                        messages.push( `Quote is missing key: ${key}` )
                    } else if( typeof quote[ key ] !== type ) {
                        messages.push( `Quote key: ${key} is not a ${type}` )
                    }
                } )
        }


        if( privateKey === undefined ) {
            messages.push( `Private key is undefined` )
        } else if( typeof privateKey !== 'string' ) {
            messages.push( `Private key is not a string` )
        }

        if( skipConfirmation === undefined ) {
            messages.push( `skipConfirmation is undefined` )
        } else if( typeof skipConfirmation !== 'boolean' ) {
            messages.push( `skipConfirmation is not a boolean` )
        }

        const status = messages.length === 0 ? true : false

        return { messages, status }
    }


    #validateUpdateRoom( { roomId, type, params } ) {
        const messages = []

        if( !roomId ) {
            messages.push( `roomId is undefined` )
        } else if( typeof roomId !== 'string' ) {
            messages.push( `roomId is not a string` )
        } else {
            const validRooms = Object.keys( rooms['rooms'] )
            if( !validRooms.includes( roomId ) ) {
                const suggestion = this.#findClosestString( { input: roomId, keys: validRooms } )
                messages.push( `roomId '${roomId}' is unknown. Did you mean '${suggestion}'?` )
            }
        }

        if( !type ) {
            messages.push( `type is undefined` )
        } else if( typeof type !== 'string' ) {
            messages.push( `type is not a string` )
        } else if( type !== 'join' && type !== 'leave' ) {
            messages.push( `type is not 'join' or 'leave'` )
        }

        if( messages.length !== 0 ) { 
            return { messages, 'status': false } 
        } else if( params === undefined ) {
            messages.push( `Params is undefined` )
        } else if( typeof params !== 'object' ) {
            messages.push( `Params is not an object` )
        } else {
            const validParams = rooms['rooms'][ roomId ]['variables']
            validParams
                .forEach( ( [ key, type ] ) => {
                    if( !params[ key ] ) {
                        messages.push( `Missing parameter: ${key} (required)` )
                    } else {
                        const { regex, description } = rooms['validation'][ type ]
                        if( !regex.test( params[ key ] ) ) {
                            messages.push( `Invalid parameter: ${key}. ${description}` )
                        }
                    }
                } )
        }

        const status = messages.length === 0 ? true : false

        return { messages, status }
    }


    #validateConnect( { wsUrl } ) {
        const messages = []

        if( !wsUrl ) {
            messages.push( `wsUrl is undefined` )
        } else if( typeof wsUrl !== 'string' ) {
            messages.push( `wsUrl is not a string` )
        } else if( !wsUrl.startsWith( 'ws://' ) && !wsUrl.startsWith( 'wss://' ) ) {
            messages.push( `wsUrl is not a valid websocket url` )
        }

        const status = messages.length === 0 ? true : false

        return { messages, status }
    }


    #validateMethod( { route } ) {
        const messages = []
        if( !route ) {
            messages.push( `route is undefined` )
        } else if( typeof route !== 'string' ) {
            messages.push( `route '${route}' is not a string.` )
        } else if( !this.#validMethods.includes( route ) ) {
            const suggestion = this.#findClosestString( { input: route, keys: this.#validMethods } )
            messages.push( `route '${route}' is unknown. Do you mean '${suggestion}'?` )
        }

        const status = messages.length === 0 ? true : false
        return { messages, status }
    }


    #validateParams( { route, params } ) {
        const messages = []
        if( !this.#validMethods.includes( route ) ) {
            return { 'messages': [], 'status': false }
        }

        const { inserts } = this.#config['endpoints'][ route ]
        if( params === undefined ) {
            messages.push( `Params is undefined` )
        } else if( typeof params !== 'object' ) {
            messages.push( `Params is not an object` )
        } else {
            const { body, query, inserts, validation } = this.#config['endpoints'][ route ]

            let validParams = []
            if( body ) { validParams = [ ...validParams, ...Object.entries( body ) ] }
            if( query ) { 
                validParams = [ ...validParams, ...Object.entries( query ) ] }
            if( inserts ) { validParams = [ ...validParams, ...inserts.map( key => [ key, true ] ) ] }

            validParams
                .forEach( ( [ key, required ] ) => {
                    if( !params[ key ] && required ) {
                        messages.push( `Missing parameter: ${key} (required)` )
                    }
                } )

            const validParamsKeys = validParams.map( ( [ key, ] ) => key )
            Object
                .keys( params )
                .forEach( key => {
                    if( !validParamsKeys.includes( key ) ) {
                        const suggestion = this.#findClosestString( { input: key, keys: validParamsKeys } )
                        messages.push( `Invalid parameter: ${key}. Did you mean '${suggestion}'?` )
                    }
                } )

            if( validation !== undefined ) {
                Object
                    .entries( validation )
                    .forEach( ( [ key, values ] ) => {
                        if( params[ key ] === undefined ) {
                            return false
                        }

                        if( !values.includes( params[ key ] ) ) {
                            messages.push( `Key '${key}:' Invalid value for parameter: ${key}. Choose from ${values.join(',')} instead.` )
                        }
                    } )
            }
        }

        const status = messages.length === 0 ? true : false
        return { messages, status }
    }


    #findClosestString( { input, keys } ) {
        function distance( a, b ) {
            let dp = Array( a.length + 1 )
                    .fill( null )
                    .map( () => Array( b.length + 1 )
                    .fill( 0 )
                )
                .map( ( z, index, all ) => {
                    index === 0 ? z = z.map( ( y, rindex ) => rindex ) : ''
                    z[ 0 ] = index 
                    return z
                } )
    
            dp = dp
                .map( ( z, i ) => {
                    return z.map( ( y, j ) => {
                        if( i > 0 && j > 0 ) {
                            if( a[ i - 1 ] === b[ j - 1 ] ) {
                                y = dp[ i - 1 ][ j - 1 ]
                            } else {
                                const min = Math.min(
                                    dp[ i - 1 ][ j ], 
                                    dp[ i ][ j - 1 ], 
                                    dp[ i - 1 ][ j - 1 ]
                                )
                                y = 1 + min
                            }
                        }
                        return y
                    } )
                } )
    
            return dp[ a.length ][ b.length ]
        }
    
    
        const result = keys
            .reduce( ( acc, key, index ) => {
                const currentDistance = distance( input, key )
                if( index === 0 ) {
                    acc = {
                        'closestKey': key,
                        'closestDistance': currentDistance
                    }
                }
                
                if( currentDistance < acc['closestDistance'] ) {
                    acc['closestKey'] = key;
                    acc['closestDistance'] = currentDistance;
                }
    
                return acc
            }, {} )
    
        return result['closestKey']
    }
}


export { Validation}
