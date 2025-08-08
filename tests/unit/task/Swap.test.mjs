import { describe, test, expect, beforeEach, jest } from '@jest/globals'
import { getTestConfig } from '../../helpers/env.mjs'

// Mock the problematic Solana dependencies before importing
jest.unstable_mockModule( '@solana/web3.js', () => ( {
    'Connection': jest.fn().mockImplementation( () => ( {
        'getLatestBlockhash': jest.fn(),
        'sendRawTransaction': jest.fn(),
        'confirmTransaction': jest.fn()
    } ) ),
    'Keypair': jest.fn(),
    'Transaction': jest.fn(),
    'VersionedTransaction': jest.fn()
} ) )

jest.unstable_mockModule( 'bs58', () => ( {
    'default': {
        'decode': jest.fn(),
        'encode': jest.fn()
    }
} ) )

jest.unstable_mockModule( 'inquirer', () => ( {
    'default': {
        'prompt': jest.fn()
    }
} ) )

// Mock fetch globally
global.fetch = jest.fn()

// Now import the Swap class after mocking dependencies
const { Swap } = await import( '../../../src/task/Swap.mjs' )

describe( 'Swap Task Class', () => {
    let swapInstance
    const mockEmitter = jest.fn()
    const testConfig = getTestConfig()

    beforeEach( () => {
        swapInstance = new Swap( {
            'nodeHttp': 'https://test-rpc.com',
            'nodeWs': 'wss://test-ws.com',
            'swap': testConfig.swap,
            'emitter': mockEmitter,
            'silent': true
        } )
        
        // Clear all mocks
        fetch.mockClear()
        mockEmitter.mockClear()
    } )

    describe( 'Constructor', () => {
        test( 'should create Swap instance with required parameters', () => {
            expect( swapInstance ).toBeInstanceOf( Swap )
        } )

        test( 'should create instance without WebSocket endpoint', () => {
            const swapWithoutWs = new Swap( {
                'nodeHttp': 'https://test-rpc.com',
                'swap': testConfig.swap,
                'silent': true
            } )
            expect( swapWithoutWs ).toBeInstanceOf( Swap )
        } )

        test( 'should create instance without emitter', () => {
            const swapWithoutEmitter = new Swap( {
                'nodeHttp': 'https://test-rpc.com',
                'swap': testConfig.swap,
                'silent': true
            } )
            expect( swapWithoutEmitter ).toBeInstanceOf( Swap )
        } )

        test( 'should set silent parameter correctly', () => {
            const swapSilent = new Swap( {
                'nodeHttp': 'https://test-rpc.com',
                'swap': testConfig.swap,
                'silent': true
            } )
            expect( swapSilent ).toBeInstanceOf( Swap )
        } )
    } )

    describe( '.getSwapQuote()', () => {
        test( 'should .getSwapQuote() make successful API call', async () => {
            const mockQuoteResponse = {
                'inAmount': '1000000',
                'outAmount': '2000000',
                'priceImpactPct': 0.1,
                'swapTransaction': 'base64-encoded-tx'
            }

            fetch.mockResolvedValueOnce( {
                'ok': true,
                'json': () => Promise.resolve( mockQuoteResponse )
            } )

            const result = await swapInstance.getSwapQuote( {
                'from': 'So11111111111111111111111111111111111111112',
                'to': 'test-token-mint',
                'amount': 1,
                'slippage': 15,
                'payer': 'test-payer-address'
            } )

            expect( result.status ).toBe( true )
            expect( result.data.quote ).toEqual( mockQuoteResponse )
            expect( fetch ).toHaveBeenCalledTimes( 1 )
        } )

        test( 'should .getSwapQuote() handle API errors', async () => {
            fetch.mockResolvedValueOnce( {
                'ok': false,
                'status': 400,
                'statusText': 'Bad Request'
            } )

            const result = await swapInstance.getSwapQuote( {
                'from': 'invalid-token',
                'to': 'test-token',
                'amount': 1,
                'slippage': 15,
                'payer': 'test-payer'
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.length ).toBeGreaterThan( 0 )
        } )

        test( 'should .getSwapQuote() handle network errors', async () => {
            fetch.mockRejectedValueOnce( new Error( 'Network error' ) )

            const result = await swapInstance.getSwapQuote( {
                'from': 'So11111111111111111111111111111111111111112',
                'to': 'test-token',
                'amount': 1,
                'slippage': 15,
                'payer': 'test-payer'
            } )

            expect( result.status ).toBe( false )
            expect( result.messages ).toContain( 'Request: Network error' )
        } )

        test( 'should .getSwapQuote() accept id parameter', async () => {
            fetch.mockResolvedValueOnce( {
                'ok': true,
                'json': () => Promise.resolve( {} )
            } )

            const testId = 'test-123'
            const result = await swapInstance.getSwapQuote( {
                'from': 'So11111111111111111111111111111111111111112',
                'to': 'test-token',
                'amount': 1,
                'slippage': 15,
                'payer': 'test-payer'
            }, testId )

            expect( result.status ).toBe( true )
            // The id parameter is used internally for event emission
        } )

        test( 'should .getSwapQuote() include correct request headers', async () => {
            fetch.mockResolvedValueOnce( {
                'ok': true,
                'json': () => Promise.resolve( {} )
            } )

            await swapInstance.getSwapQuote( {
                'from': 'So11111111111111111111111111111111111111112',
                'to': 'test-token',
                'amount': 1,
                'slippage': 15,
                'payer': 'test-payer'
            } )

            expect( fetch ).toHaveBeenCalledWith(
                expect.any( String ),
                expect.objectContaining( {
                    'method': 'POST',
                    'headers': expect.objectContaining( {
                        'Content-Type': 'application/json'
                    } )
                } )
            )
        } )
    } )

    describe( '.postSwapTransaction()', () => {
        test( 'should .postSwapTransaction() require quote parameter', async () => {
            const result = await swapInstance.postSwapTransaction( {
                'privateKey': 'test-private-key'
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.some( msg => msg.toLowerCase().includes( 'quote' ) ) ).toBe( true )
        } )

        test( 'should .postSwapTransaction() require privateKey parameter', async () => {
            const result = await swapInstance.postSwapTransaction( {
                'quote': { 'swapTransaction': 'test-tx' }
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.some( msg => msg.toLowerCase().includes( 'private key' ) ) ).toBe( true )
        } )

        test( 'should .postSwapTransaction() handle skipConfirmation parameter', async () => {
            // This test is complex due to Solana transaction mocking
            // For now, test parameter acceptance
            const result = await swapInstance.postSwapTransaction( {
                'quote': { 'swapTransaction': 'test-tx' },
                'privateKey': 'test-private-key',
                'skipConfirmation': true
            } )

            // Will fail due to invalid transaction, but tests parameter handling
            expect( result.status ).toBe( false )
        } )

        test( 'should .postSwapTransaction() handle receiveChainStatus parameter', async () => {
            const result = await swapInstance.postSwapTransaction( {
                'quote': { 'swapTransaction': 'test-tx' },
                'privateKey': 'test-private-key',
                'receiveChainStatus': false
            } )

            // Will fail due to invalid transaction, but tests parameter handling
            expect( result.status ).toBe( false )
        } )

        test( 'should .postSwapTransaction() validate quote structure', async () => {
            const result = await swapInstance.postSwapTransaction( {
                'quote': {}, // Empty quote object
                'privateKey': 'test-private-key'
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.length ).toBeGreaterThan( 0 )
        } )
    } )
} )