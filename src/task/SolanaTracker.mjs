import { config } from '../data/config.mjs'
import { endpoints } from '../data/endpoints.mjs'
import { findClosestString } from './helpers.mjs'

import { Validation } from './Validation.mjs'
import axios from 'axios'


class SolanaTracker {
    #config
    #endpoints
    #state
    #validation


    constructor( { apiKey } ) {
        this.#state = {}
        this.setApiKey( { apiKey } )

        this.#config = config
        this.#endpoints = endpoints
        this.#validation = new Validation( {} )
    }


    async request( { route, params={} } ) {
        const { messages, status } = this.#validation.request( { route, params } )
        if( !status ) { return { 'status': false, messages, 'data': null } }
        const response = await this.#request( { route, params } )

        return response
    }


    setApiKey( { apiKey } ) {
        this.#state['apiKey'] = apiKey

        return true
    }


    getMethods() {
        return Object.keys( this.#endpoints )
    }


    health() {
        return true
    }


    async #request( { route, params } ) {
        const result = {
            'status': false,
            'message': null,
            'data': {}
        }

        const endpoint = this.#endpoints[ route ]
        const { baseUrl } = this.#config['solanaTracker']
        const { route: r, query, requestMethod, body } = endpoint

        let queryStr = ''
        if( query !== undefined ) {
            queryStr = Object
                .entries( query )
                .reduce( ( acc, [ k, v ], index, arr ) => {
                    if( params[ k ] !== undefined ) { 
                        acc.push( [ k, params[ k ] ] )
                    }
                    return acc
                }, [] )
                .map( ( [ key, value ] ) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}` )
                .join( '&' )
            queryStr = queryStr.length > 0 ? `?${queryStr}` : ''
        }

        const { apiKey } = this.#state
        const url = this.#endpoints[ route ]['inserts']
            .reduce( ( acc, key ) => {
                acc = acc.replace( `{${key}}`, params[ key ] )
                return acc
            }, `${baseUrl}${r}${queryStr}` )
        const headers = { 'x-api-key': apiKey }

        try {
            let response = null
            if( requestMethod === 'GET' ) {
                response = await axios.get( url, { headers } )
            } else if( requestMethod === 'POST' ) {
                const data = Object
                    .entries( body )
                    .reduce( ( acc, [ key, value ], index ) => {
                        if( params[ key ] !== undefined ) {
                            acc[ key ] = params[ key ]
                        }

                        return acc
                    }, {} )

                response = await axios.post( url, data, { headers } )
            }

            result['status'] = true
            result['data'] = response['data']
        } catch( error ) {
            result['message'] = `Request: ${error['message']}`
            result['status'] = false
        }

        return result
    }
}


export { SolanaTracker}