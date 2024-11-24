import { Validation } from './Validation.mjs'
import axios from 'axios'

import { Transaction, Keypair } from '@solana/web3.js'


class Swap {
    #validation
    #config


    constructor( { solanaTracker } ) {
        this.#config = { solanaTracker }
        this.#validation = new Validation()

        return true
    }


    async getTx( params={} ) {
        const { messages, status } = this.#validation.getTx( params )
        if( !status ) { return { 'status': false, messages, 'data': null } }
        const response = await this.#getTx( params )

        return response
    }


    async send( { response, privateKey } ) {
        const keypair = Keypair
            .fromSecretKey( bs58.decode( privateKey ) )

        const { data } = response
        const { txn, type } = data

        let txid
        if ( type === 'v0' ) {
            const txn = VersionedTransaction.deserialize(serializedTransactionBuffer)
            txn.sign( [ keypair ] )
        
            txid = await connection.sendRawTransaction(
                txn.serialize(), { 'skipPreflight': true } 
            )
        } else {
            const txn = Transaction.from(serializedTransactionBuffer);
            txn.sign( keypair )
            const rawTransaction = txn.serialize();
            txid = await connection.sendRawTransaction(rawTransaction, {
                'skipPreflight': true
            } )
        }
    }


    parseTx( { response } ) {
        const { data } = response
        const { txn, type } = data

        const serializedTransactionBuffer = Buffer.from( txn, 'base64')
        let txnMod
        if( type === 'v0' ) {
            txnMod = VersionedTransaction.deserialize( serializedTransactionBuffer )
        } else {
            txnMod = Transaction.from( serializedTransactionBuffer )
        }
        
        if( !txnMod ) return false
    }


    async #getTx( params ) {
        const { swapUrl } = this.#config['solanaTracker']

        const headers = { 
            'Content-Type': 'application/json'
        }

        const result = {
            'status': false,
            'message': null,
            'data': {}
        }

        try {
            const response = await axios.post( swapUrl, params, { headers } )
            result['status'] = true
            result['data'] = response['data']
        } catch( error ) {
            result['message'] = `Request: ${error['message']}`
            result['status'] = false
        }

        return result
    }
}


export { Swap }