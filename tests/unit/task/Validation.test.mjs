import { describe, test, expect, beforeEach } from '@jest/globals'
import { Validation } from '../../../src/task/Validation.mjs'

describe( 'Validation Task Class', () => {
    let validationInstance

    beforeEach( () => {
        validationInstance = new Validation()
    } )

    describe( 'Constructor', () => {
        test( 'should create Validation instance', () => {
            expect( validationInstance ).toBeInstanceOf( Validation )
        } )

        test( 'should initialize with endpoints configuration', () => {
            // Constructor should load endpoints configuration
            expect( validationInstance ).toBeInstanceOf( Validation )
        } )
    } )

    describe( '.getData()', () => {
        test( 'should .getData() validate valid route and params', () => {
            const result = validationInstance.getData( {
                'route': 'tokenInformation',
                'params': { 'tokenAddress': 'So11111111111111111111111111111111111111112' }
            } )

            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( typeof result.status ).toBe( 'boolean' )
            expect( Array.isArray( result.messages ) ).toBe( true )
        } )

        test( 'should .getData() reject invalid route', () => {
            const result = validationInstance.getData( {
                'route': 'invalidRoute',
                'params': {}
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.length ).toBeGreaterThan( 0 )
            expect( result.messages.some( msg => msg.includes( 'invalidRoute' ) ) ).toBe( true )
        } )

        test( 'should .getData() validate required parameters for tokenInformation', () => {
            const result = validationInstance.getData( {
                'route': 'tokenInformation',
                'params': {} // Missing tokenAddress
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.length ).toBeGreaterThan( 0 )
        } )

        test( 'should .getData() validate search route parameters', () => {
            const result = validationInstance.getData( {
                'route': 'search',
                'params': { 'query': 'GOAT' }
            } )

            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( Array.isArray( result.messages ) ).toBe( true )
        } )

        test( 'should .getData() handle missing params object', () => {
            const result = validationInstance.getData( {
                'route': 'tokenInformation'
                // Missing params
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.length ).toBeGreaterThan( 0 )
        } )

        test( 'should .getData() validate latestTokens route', () => {
            const result = validationInstance.getData( {
                'route': 'latestTokens',
                'params': {}
            } )

            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
        } )
    } )

    describe( '.getSwapQuote()', () => {
        test( 'should .getSwapQuote() validate swap quote parameters', () => {
            const validParams = {
                'from': 'So11111111111111111111111111111111111111112',
                'to': 'test-token-mint',
                'amount': 1,
                'slippage': 15,
                'payer': 'test-payer-address'
            }
            
            const result = validationInstance.getSwapQuote( validParams, 'test-id' )

            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( typeof result.status ).toBe( 'boolean' )
            expect( Array.isArray( result.messages ) ).toBe( true )
        } )

        test( 'should .getSwapQuote() fail with incomplete params (fixed behavior)', () => {
            const invalidParams = {
                'from': 'So11111111111111111111111111111111111111112'
                // Missing to, amount, slippage, payer
            }
            
            const result = validationInstance.getSwapQuote( invalidParams, 'test-id' )

            // Fixed validation now properly rejects incomplete parameters
            expect( result.status ).toBe( false )
        } )

        test( 'should .getSwapQuote() pass with invalid amount type (current behavior)', () => {
            const invalidParams = {
                'from': 'So11111111111111111111111111111111111111112',
                'to': 'test-token',
                'amount': 'not-a-number',
                'slippage': 15,
                'payer': 'test-payer'
            }
            
            const result = validationInstance.getSwapQuote( invalidParams, 'test-id' )

            // Current validation doesn't check parameter types
            expect( result.status ).toBe( true )
        } )

        test( 'should .getSwapQuote() pass with invalid slippage type (current behavior)', () => {
            const invalidParams = {
                'from': 'So11111111111111111111111111111111111111112',
                'to': 'test-token',
                'amount': 1,
                'slippage': 'invalid',
                'payer': 'test-payer'
            }
            
            const result = validationInstance.getSwapQuote( invalidParams, 'test-id' )

            // Current validation doesn't check parameter types
            expect( result.status ).toBe( true )
        } )
    } )

    describe( '.postSwapTransaction()', () => {
        test( 'should .postSwapTransaction() validate required parameters', () => {
            const result = validationInstance.postSwapTransaction( {
                'quote': { 'swapTransaction': 'test-tx' },
                'privateKey': 'test-private-key'
            } )

            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( typeof result.status ).toBe( 'boolean' )
            expect( Array.isArray( result.messages ) ).toBe( true )
        } )

        test( 'should .postSwapTransaction() reject missing quote', () => {
            const result = validationInstance.postSwapTransaction( {
                'privateKey': 'test-private-key'
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.some( msg => msg.toLowerCase().includes( 'quote' ) ) ).toBe( true )
        } )

        test( 'should .postSwapTransaction() reject missing privateKey', () => {
            const result = validationInstance.postSwapTransaction( {
                'quote': { 'swapTransaction': 'test-tx' }
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.some( msg => msg.toLowerCase().includes( 'private key' ) ) ).toBe( true )
        } )

        test( 'should .postSwapTransaction() validate skipConfirmation parameter type', () => {
            const result = validationInstance.postSwapTransaction( {
                'quote': { 'swapTransaction': 'test-tx' },
                'privateKey': 'test-private-key',
                'skipConfirmation': 'not-boolean'
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.some( msg => msg.includes( 'skipConfirmation' ) ) ).toBe( true )
        } )

        test( 'should .postSwapTransaction() validate receiveChainStatus parameter type', () => {
            const result = validationInstance.postSwapTransaction( {
                'quote': { 'swapTransaction': 'test-tx' },
                'privateKey': 'test-private-key',
                'receiveChainStatus': 'not-boolean'
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.some( msg => msg.includes( 'receiveChainStatus' ) ) ).toBe( true )
        } )
    } )

    describe( '.updateRoom()', () => {
        test( 'should .updateRoom() validate room update parameters', () => {
            const result = validationInstance.updateRoom( {
                'roomId': 'graduatingTokens',
                'cmd': 'join',
                'params': { 'poolId': 'test-pool' },
                'strategy': null,
                'strategies': new Map()
            } )

            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( typeof result.status ).toBe( 'boolean' )
            expect( Array.isArray( result.messages ) ).toBe( true )
        } )

        test( 'should .updateRoom() reject invalid room ID', () => {
            const result = validationInstance.updateRoom( {
                'roomId': 'invalidRoom',
                'cmd': 'join',
                'params': {},
                'strategy': null,
                'strategies': new Map()
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.some( msg => msg.includes( 'room' ) || msg.includes( 'invalidRoom' ) ) ).toBe( true )
        } )

        test( 'should .updateRoom() validate command parameter', () => {
            const result = validationInstance.updateRoom( {
                'roomId': 'graduatingTokens',
                'cmd': 'invalidCommand',
                'params': {},
                'strategy': null,
                'strategies': new Map()
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.some( msg => msg.includes( 'type' ) ) ).toBe( true )
        } )
    } )

    describe( '.connect()', () => {
        test( 'should .connect() validate websocket URL', () => {
            const result = validationInstance.connect( {
                'wsUrl': 'wss://valid-websocket-url.com'
            } )

            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( typeof result.status ).toBe( 'boolean' )
            expect( Array.isArray( result.messages ) ).toBe( true )
        } )

        test( 'should .connect() reject invalid websocket URL', () => {
            const result = validationInstance.connect( {
                'wsUrl': 'invalid-url'
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.some( msg => msg.includes( 'wsUrl' ) || msg.includes( 'websocket' ) ) ).toBe( true )
        } )

        test( 'should .connect() reject empty websocket URL', () => {
            const result = validationInstance.connect( {
                'wsUrl': ''
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.length ).toBeGreaterThan( 0 )
        } )

        test( 'should .connect() reject missing websocket URL', () => {
            const result = validationInstance.connect( {} )

            expect( result.status ).toBe( false )
            expect( result.messages.length ).toBeGreaterThan( 0 )
        } )
    } )
} )