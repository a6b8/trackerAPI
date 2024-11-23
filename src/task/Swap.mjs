import { Validation } from './Validation.mjs'
import axios from 'axios'

import { Transaction } from '@solana/web3.js'


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


    parseTx( { response } ) {
        const { data } = response
        const { txn, type } = data

// check 
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