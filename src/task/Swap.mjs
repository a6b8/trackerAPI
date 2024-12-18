import { Validation } from './Validation.mjs'
// import { config } from '../data/config.mjs'

import inquirer from 'inquirer'
import axios from 'axios'
import bs58 from 'bs58'
import { 
    Transaction, 
    Keypair, 
    VersionedTransaction, 
    Connection 
} from '@solana/web3.js'


class Swap {
    #validation
    #config
    #connection
    #emitter
    #state


    constructor( { nodeHttp, nodeWs, swap, emitter=null } ) {
        this.#config = { ...swap }
        this.#validation = new Validation()

        this.#state = {
            'emitterAvailable': ( emitter === null ) ? false : true,
            'websocketAvailable':  typeof nodeWs === 'string' && nodeWs.length > 0
        }

        this.#setConnection( { nodeHttp, nodeWs } )
        this.#emitter = emitter

        return true
    }


    #setConnection( { nodeHttp, nodeWs } ) {
        const { websocketAvailable } = this.#state
        if( websocketAvailable ) {
            this.#connection = new Connection(
                nodeHttp,
                { 'wsEndpoint': nodeWs }
            )
        } else {
            this.#connection = new Connection( nodeHttp )
        }

        return true
    }


    async getSwapQuote( params={}, id='n/a' ) {
        const { messages, status } = this.#validation.getSwapQuote( params, id )
        if( !status ) { return { 'status': false, messages, 'data': null } }

        {
            const eventStatus = this.#config['eventStates']['getSwapQuote'][ 0 ]
            this.#sendEvent( { id, eventStatus, 'data': null } )
        }
        const response = await this.#getSwapQuote( params, id )
        {
            const eventStatus = this.#config['eventStates']['getSwapQuote'][ 1 ]
            this.#sendEvent( { id, eventStatus, 'data': null } )
        }
        return response
    }


    async #getSwapQuote( params, id ) {
        const { rootUrl } = this.#config

        const headers = { 
            'Content-Type': 'application/json'
        }

        const result = {
            'status': false,
            'messages': [],
            'data': {
                'request': params,
                'quote': {},
                'swap': {
                    'id': null,
                    'tx': null
                 }
            },
            id
        }

        try {
            const response = await axios.post( rootUrl, params, { headers } )
            result['status'] = true
            result['data']['quote'] = response['data']
        } catch( error ) {
            result['messages'].push( `Request: ${error['message']}` )
            result['status'] = false
        }

        return result
    }


    async postSwapTransaction( { quote, privateKey, skipConfirmation=false, receiveChainStatus=true } ) {
        const { messages, status } = this.#validation.postSwapTransaction( { quote, privateKey, skipConfirmation, receiveChainStatus } )
        if( !status ) { return { 'status': false, messages, 'data': null } }

        if( !skipConfirmation ) {
            this.#printQuote( { quote } )
            const { userChoice } = await inquirer.prompt( [
                {
                    'type': 'list', 
                    'name': 'userChoice', 
                    'default': 'No',
                    'message': 'Are you sure you want to send the transaction?',
                    'choices': [ 'Yes', 'No' ]
                } 
            ] )

            if( userChoice === 'No' ) {
                return { 'status': false, 'messages': [ 'User cancelled' ], 'data': null }
            }
        }


        const { id } = quote
        {
            const eventStatus = this.#config['eventStates']['postSwapTransaction'][ 0 ]
            this.#sendEvent( { id, eventStatus, 'data': null } )
        }
        const response = await this.#postSwapTransaction( { quote, privateKey } )
        {
            const eventStatus = this.#config['eventStates']['postSwapTransaction'][ 1 ]
            this.#sendEvent( { id, eventStatus, 'data': null } )
        }

        if( response['status'] === false ) { return response }
        if( receiveChainStatus === false ) { return response }

        const { websocketAvailable, emitterAvailable } = this.#state
        if( !websocketAvailable ) { 
            console.log( `Websocket not available. Skipping confirmation.` )
            return response 
        }
        if( !emitterAvailable ) {
            console.log( `Emitter not available. Skipping confirmation.` )
            return response
        }
// console.log( 'response', JSON.stringify( response, null, 4 ) )
        const signature = response['data']['swap']['id']
        this.#confirmationSignature( { signature, id } )

        return response
    }


    async #postSwapTransaction( { quote, privateKey } ) {
        if( quote['status'] === false ) { return quote }
        const result = { ...quote }

        const { data } = quote
        const { type, txn } = data['quote']

        try {
            const keypair = Keypair.fromSecretKey( bs58.decode( privateKey ) )

            const serializedTransactionBuffer = Buffer.from( txn, 'base64' )
            let txid
            if( type === 'v0' ) {
                const tx = VersionedTransaction.deserialize( serializedTransactionBuffer )
                tx.sign( [ keypair ] )

                txid = await this.#connection.sendRawTransaction(
                    tx.serialize(), 
                    { 'skipPreflight': true } 
                )

                result['status'] = true
                result['data']['swap']['id'] = txid
                result['data']['swap']['tx'] = tx
            } else {
                const tx = Transaction.from( serializedTransactionBuffer )
                tx.sign( keypair )
                const rawTransaction = tx.serialize()

                txid = await this.#connection.sendRawTransaction(
                    rawTransaction, 
                    { 'skipPreflight': true } 
                )

                result['status'] = true
                result['data']['swap']['id'] = txid
                result['data']['swap']['tx'] = tx
            }
        } catch( e ) {
            result['status'] = false
            result['messages'].push( `Error: ${e.message}` )
        }

        return result
    }


    #confirmationSignature( { signature, id } ) {
        const { wsConfirmationsLevels } = this.#config

        {
            const eventStatus = this.#config['eventStates']['confirmationSignature'][ 0 ]
            this.#sendEvent( { id, eventStatus, 'data': null } )
        }

        Promise.all(
            wsConfirmationsLevels
                .map( ( { commitment, eventStatus } ) => {
                    return new Promise( ( resolve, reject ) => {
                        this.#connection.onSignatureWithOptions( 
                            signature, 
                            ( result, context ) => {
                                const { slot } = context
                                const { err } = result
                                if( err ) { reject( err ) }
                                this.#sendEvent( { id, eventStatus, 'data': { 'slot': slot } } )
                                resolve( { 'commitment': commitment, 'slot': slot } )
                            } ),
                            { commitment }
                    } )
                } )
        )
            .then( ( data ) => {
                const eventStatus = this.#config['eventStates']['confirmationSignature'][ 1 ]
                this.#sendEvent( { id, eventStatus, 'data': null } )
            } )

        return true
    }


    #printQuote( { quote } ) {
        function padLeft( value, width ) {
            return String( value ).padEnd( width, ' ' )
        }

        const { request } = quote['data']
        const formattedRate = Object
            .entries( request )
            .map( ( [ key, value ] ) => ( {
                Key: padLeft( key, 20 ),
                Value: padLeft( typeof value === "object" ? JSON.stringify( value ) : value, 60 )
            }));
          
        console.log( 'Request' )
        console.table( formattedRate )

        return true
    }


    #sendEvent( { id, eventStatus, data } ) {
        const { emitterAvailable } = this.#state
        if( !emitterAvailable ) { return false }

        const { eventPrefix } = this.#config
        const payload = { id, eventStatus, ...data }
        this.#emitter( eventPrefix, payload )
        return true

    }
}


export { Swap }