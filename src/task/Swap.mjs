import { Validation } from './Validation.mjs'
import { config } from '../data/config.mjs'

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


    constructor( { nodeUrl } ) {
        this.#config = config
        this.#validation = new Validation()
        this.setConnection( { nodeUrl } )

        return true
    }


    setConnection( { nodeUrl } ) {
        this.#connection = new Connection( nodeUrl )
        return true
    }


    async getSwapQuote( params={} ) {
        const { messages, status } = this.#validation.getSwapQuote( params )
        if( !status ) { return { 'status': false, messages, 'data': null } }
        const response = await this.#getSwapQuote( params )
        return response
    }


    async #getSwapQuote( params ) {
        const { swapUrl } = this.#config

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
            }
        }

        try {
            const response = await axios.post( swapUrl, params, { headers } )
            result['status'] = true
            result['data']['quote'] = response['data']
        } catch( error ) {
            result['messages'].push( `Request: ${error['message']}` )
            result['status'] = false
        }

        return result
    }


    async postSwap( { quote, privateKey, skipConfirmation=false } ) {
        const { messages, status } = this.#validation.postSwap( { quote, privateKey, skipConfirmation } )
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

        const response = await this.#postSwap( { quote, privateKey } )
        return response
    }


    async #postSwap( { quote, privateKey } ) {
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
}


export { Swap }