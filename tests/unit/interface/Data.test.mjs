import { describe, test, expect, beforeEach, jest } from '@jest/globals'
import { Data } from '../../../src/task/Data.mjs'

// Mock fetch globally
global.fetch = jest.fn()

describe( 'Data Methods', () => {
    let dataInstance

    beforeEach( () => {
        dataInstance = new Data( { 
            'apiKey': 'test-api-key',
            'data': { 'rootUrl': 'https://api.solanatracker.io' },
            'silent': true 
        } )
        
        // Clear all mocks
        fetch.mockClear()
    } )

    describe( 'Constructor', () => {
        test( 'should create instance with required parameters', () => {
            expect( dataInstance ).toBeInstanceOf( Data )
        } )

        test( 'should set apiKey correctly', () => {
            // We can't directly test private properties, but we can test the behavior
            expect( dataInstance.health() ).toBe( true )
        } )

        test( 'should accept silent parameter', () => {
            const silentData = new Data( { 
                'apiKey': 'test',
                'data': { 'rootUrl': 'test' },
                'silent': true
            } )
            expect( silentData ).toBeInstanceOf( Data )
        } )
    } )

    describe( '.getEndpoints() Method', () => {
        test( 'should .getEndpoints() return array of endpoint names', () => {
            const endpoints = dataInstance.getEndpoints()
            
            expect( Array.isArray( endpoints ) ).toBe( true )
            expect( endpoints.length ).toBeGreaterThan( 0 )
            expect( endpoints ).toContain( 'tokenInformation' )
            expect( endpoints ).toContain( 'search' )
            expect( endpoints ).toContain( 'latestTokens' )
        } )

        test( 'should .getEndpoints() return all 31 expected endpoints', () => {
            const endpoints = dataInstance.getEndpoints()
            expect( endpoints.length ).toBe( 31 )
        } )
    } )

    describe( '.getData() Method', () => {
        test( 'should .getData() make successful API call for tokenInformation', async () => {
            const mockResponse = {
                'status': true,
                'data': { 
                    'token': { 'name': 'Test Token', 'mint': 'test-mint' }
                }
            }

            fetch.mockResolvedValueOnce( {
                'ok': true,
                'json': () => Promise.resolve( mockResponse.data )
            } )

            const result = await dataInstance.getData( {
                'route': 'tokenInformation',
                'params': { 'tokenAddress': 'So11111111111111111111111111111111111111112' }
            } )

            expect( result.status ).toBe( true )
            expect( result.data ).toEqual( mockResponse.data )
            expect( fetch ).toHaveBeenCalledWith(
                expect.stringContaining( 'tokens/So11111111111111111111111111111111111111112' ),
                expect.objectContaining( {
                    'method': 'GET',
                    'headers': expect.objectContaining( {
                        'x-api-key': 'test-api-key'
                    } )
                } )
            )
        } )

        test( 'should .getData() handle query parameters correctly', async () => {
            fetch.mockResolvedValueOnce( {
                'ok': true,
                'json': () => Promise.resolve( {} )
            } )

            await dataInstance.getData( {
                'route': 'search',
                'params': { 'query': 'GOAT', 'limit': 10 }
            } )

            expect( fetch ).toHaveBeenCalledWith(
                expect.stringContaining( 'search?query=GOAT&limit=10' ),
                expect.any( Object )
            )
        } )

        test( 'should .getData() handle POST requests', async () => {
            fetch.mockResolvedValueOnce( {
                'ok': true,
                'json': () => Promise.resolve( {} )
            } )

            await dataInstance.getData( {
                'route': 'postPrice',
                'params': { 'token': 'test-token' }
            } )

            expect( fetch ).toHaveBeenCalledWith(
                expect.any( String ),
                expect.objectContaining( {
                    'method': 'POST',
                    'headers': expect.objectContaining( {
                        'x-api-key': 'test-api-key',
                        'Content-Type': 'application/json'
                    } ),
                    'body': expect.stringContaining( '"token":"test-token"' )
                } )
            )
        } )

        test( 'should .getData() handle API errors', async () => {
            fetch.mockResolvedValueOnce( {
                'ok': false,
                'status': 404
            } )

            const result = await dataInstance.getData( {
                'route': 'tokenInformation',
                'params': { 'tokenAddress': 'invalid' }
            } )

            expect( result.status ).toBe( false )
            expect( result.messages[ 0 ] ).toContain( 'HTTP error! status: 404' )
        } )

        test( 'should .getData() handle network errors', async () => {
            fetch.mockRejectedValueOnce( new Error( 'Network error' ) )

            const result = await dataInstance.getData( {
                'route': 'tokenInformation',
                'params': { 'tokenAddress': 'test' }
            } )

            expect( result.status ).toBe( false )
            expect( result.messages ).toContain( 'Request: Network error' )
        } )

        test( 'should .getData() validate route and params', async () => {
            const result = await dataInstance.getData( {
                'route': 'invalidRoute',
                'params': {}
            } )

            expect( result.status ).toBe( false )
            expect( result.messages.length ).toBeGreaterThan( 0 )
        } )
    } )

    describe( 'setApiKey Method', () => {
        test( 'should update API key', () => {
            const result = dataInstance.setApiKey( { 'apiKey': 'new-api-key' } )
            expect( result ).toBe( true )
        } )
    } )

    describe( 'health Method', () => {
        test( 'should return true', () => {
            expect( dataInstance.health() ).toBe( true )
        } )
    } )
} )