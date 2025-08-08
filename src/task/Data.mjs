import { config } from '../data/config.mjs'
import { endpoints } from '../data/endpoints.mjs'
// import { findClosestString } from './helpers.mjs'

import { Validation } from './Validation.mjs'


class Data {
    #config
    #endpoints
    #state
    #validation


    constructor( { apiKey, data, silent=false } ) {
        this.#state = { silent }
        this.setApiKey( { apiKey } )

        this.#config = { ...data }
        this.#endpoints = endpoints
        this.#validation = new Validation( {} )
    }


    async getData( { route, params={} } ) {
        const { messages, status } = this.#validation.getData( { route, params } )
        if( !status ) { return { 'status': false, messages, 'data': null } }
        const response = await this.#getData( { route, params } )

        return response
    }


    setApiKey( { apiKey } ) {
        this.#state['apiKey'] = apiKey
        return true
    }


    getEndpoints() {
        return Object.keys( this.#endpoints )
    }


    health() {
        return true
    }


    async #getData( { route, params } ) {
        const result = {
            'status': false,
            'messages': [],
            'data': {}
        }

        const endpoint = this.#endpoints[ route ]
        const { rootUrl } = this.#config
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
            }, `${rootUrl}${r}${queryStr}` )
        const headers = { 'x-api-key': apiKey }

        try {
            let response = null
            if( requestMethod === 'GET' ) {
                response = await fetch( url, { 
                    method: 'GET',
                    headers 
                } )
            } else if( requestMethod === 'POST' ) {
                const data = Object
                    .entries( body )
                    .reduce( ( acc, [ key, value ], index ) => {
                        if( params[ key ] !== undefined ) {
                            acc[ key ] = params[ key ]
                        }

                        return acc
                    }, {} )

                response = await fetch( url, {
                    method: 'POST',
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify( data )
                } )
            }

            if( !response.ok ) {
                throw new Error( `HTTP error! status: ${response.status}` )
            }

            result['status'] = true
            result['data'] = await response.json()
        } catch( error ) {
            result['messages'].push( `Request: ${error['message']}` )
            result['status'] = false
        }

        return result
    }
}


export { Data }