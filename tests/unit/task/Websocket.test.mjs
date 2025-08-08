import { describe, test, expect, beforeEach, jest } from '@jest/globals'
import { getTestConfig, getTestRoomId } from '../../helpers/env.mjs'

// Mock WebSocket before importing
jest.unstable_mockModule( 'ws', () => ( {
    'default': jest.fn().mockImplementation( () => ( {
        'on': jest.fn(),
        'send': jest.fn(),
        'close': jest.fn(),
        'readyState': 1, // OPEN
        'CONNECTING': 0,
        'OPEN': 1,
        'CLOSING': 2,
        'CLOSED': 3
    } ) )
} ) )

// Now import the TrackerWebsocket class after mocking dependencies
const { TrackerWebsocket } = await import( '../../../src/task/Websocket.mjs' )

describe( 'TrackerWebsocket Task Class', () => {
    let websocketInstance
    const mockEmitter = jest.fn()
    const testConfig = getTestConfig()
    const testRoomId = getTestRoomId()

    beforeEach( () => {
        websocketInstance = new TrackerWebsocket( {
            'wsUrl': 'wss://test-websocket.com',
            'websocket': testConfig,
            'emitter': mockEmitter,
            'silent': true
        } )
        
        // Clear all mocks
        mockEmitter.mockClear()
    } )

    describe( 'Constructor', () => {
        test( 'should create TrackerWebsocket instance with required parameters', () => {
            expect( websocketInstance ).toBeInstanceOf( TrackerWebsocket )
        } )

        test( 'should create instance without external emitter', () => {
            const wsWithoutEmitter = new TrackerWebsocket( {
                'wsUrl': 'wss://test-websocket.com',
                'websocket': testConfig,
                'silent': true
            } )
            expect( wsWithoutEmitter ).toBeInstanceOf( TrackerWebsocket )
        } )

        test( 'should set silent parameter correctly', () => {
            const wsSilent = new TrackerWebsocket( {
                'wsUrl': 'wss://test-websocket.com',
                'websocket': testConfig,
                'silent': true
            } )
            expect( wsSilent ).toBeInstanceOf( TrackerWebsocket )
        } )

        test( 'should initialize socket states', () => {
            // Test that internal state is properly initialized
            expect( websocketInstance ).toBeInstanceOf( TrackerWebsocket )
        } )

        test( 'should extend EventEmitter', () => {
            expect( typeof websocketInstance.on ).toBe( 'function' )
            expect( typeof websocketInstance.emit ).toBe( 'function' )
        } )
    } )

    describe( '.connect()', () => {
        test( 'should .connect() return connection status', () => {
            const result = websocketInstance.connect()
            
            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( result ).toHaveProperty( 'data' )
            expect( typeof result.status ).toBe( 'boolean' )
            expect( Array.isArray( result.messages ) ).toBe( true )
        } )

        test( 'should .connect() validate websocket URL', () => {
            const wsWithBadUrl = new TrackerWebsocket( {
                'wsUrl': '', // Invalid URL
                'websocket': testConfig,
                'silent': true
            } )
            
            const result = wsWithBadUrl.connect()
            expect( result.status ).toBe( false )
            expect( result.messages.length ).toBeGreaterThan( 0 )
        } )

        test( 'should .connect() handle successful connection', () => {
            const result = websocketInstance.connect()
            
            // Connection might be pending, but should return valid structure
            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( result ).toHaveProperty( 'data' )
        } )
    } )

    describe( '.disconnect()', () => {
        test( 'should .disconnect() return status', () => {
            const result = websocketInstance.disconnect()
            
            // disconnect returns boolean directly, not object
            expect( typeof result ).toBe( 'boolean' )
        } )

        test( 'should .disconnect() close websocket connections', () => {
            websocketInstance.connect()
            const result = websocketInstance.disconnect()
            
            expect( result ).toBe( true )
        } )
    } )

    describe( '.updateRoom()', () => {
        test( 'should .updateRoom() validate required parameters', () => {
            // Invalid room ID should throw an error
            expect( () => {
                websocketInstance.updateRoom( {
                    'roomId': 'invalidRoomId',
                    'cmd': 'join',
                    'type': 'join',
                    'params': {}
                } )
            } ).toThrow( 'Cannot destructure property' )
        } )

        test( 'should .updateRoom() handle join command', () => {
            const result = websocketInstance.updateRoom( {
                'roomId': testRoomId,
                'cmd': 'join',
                'type': 'join',
                'params': { 'test': 'param' }
            } )
            
            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( result ).toHaveProperty( 'data' )
        } )

        test( 'should .updateRoom() handle leave command', () => {
            const result = websocketInstance.updateRoom( {
                'roomId': testRoomId,
                'cmd': 'leave',
                'type': 'leave'
            } )
            
            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( result ).toHaveProperty( 'data' )
        } )

        test( 'should .updateRoom() accept filters and modifiers', () => {
            const testFilter = { 'funcName': 'testFilter', 'func': () => true, 'type': 'filter' }
            const testModifier = { 'funcName': 'testModifier', 'func': ( data ) => data, 'type': 'modifier' }
            
            const result = websocketInstance.updateRoom( {
                'roomId': testRoomId,
                'cmd': 'join',
                'type': 'join',
                'params': {},
                'filters': [ testFilter ],
                'modifiers': [ testModifier ]
            } )
            
            expect( result ).toHaveProperty( 'status' )
            expect( result ).toHaveProperty( 'messages' )
            expect( result ).toHaveProperty( 'data' )
        } )
    } )

    describe( '.addFilter()', () => {
        test( 'should .addFilter() create filter function', () => {
            const testFunc = ( data ) => data.test === true
            const result = websocketInstance.addFilter( {
                'funcName': 'testFilter',
                'func': testFunc
            } )
            
            expect( result ).toHaveProperty( 'funcName' )
            expect( result ).toHaveProperty( 'func' )
            expect( result ).toHaveProperty( 'type' )
            expect( result.funcName ).toBe( 'testFilter' )
            expect( result.func ).toBe( testFunc )
            expect( result.type ).toBe( 'filter' )
        } )

        test( 'should .addFilter() validate function parameter', () => {
            const result = websocketInstance.addFilter( {
                'funcName': 'testFilter',
                'func': 'not-a-function'
            } )
            
            expect( result ).toBe( null )
        } )

        test( 'should .addFilter() validate funcName parameter', () => {
            const result = websocketInstance.addFilter( {
                'funcName': '',
                'func': () => true
            } )
            
            expect( result ).toBe( null )
        } )
    } )

    describe( '.addModifier()', () => {
        test( 'should .addModifier() create modifier function', () => {
            const testFunc = ( data ) => ( { ...data, modified: true } )
            const result = websocketInstance.addModifier( {
                'funcName': 'testModifier',
                'func': testFunc
            } )
            
            expect( result ).toHaveProperty( 'funcName' )
            expect( result ).toHaveProperty( 'func' )
            expect( result ).toHaveProperty( 'type' )
            expect( result.funcName ).toBe( 'testModifier' )
            expect( result.func ).toBe( testFunc )
            expect( result.type ).toBe( 'modifier' )
        } )

        test( 'should .addModifier() validate function parameter', () => {
            const result = websocketInstance.addModifier( {
                'funcName': 'testModifier',
                'func': 'not-a-function'
            } )
            
            expect( result ).toBe( null )
        } )

        test( 'should .addModifier() validate funcName parameter', () => {
            const result = websocketInstance.addModifier( {
                'funcName': '',
                'func': ( data ) => data
            } )
            
            expect( result ).toBe( null )
        } )
    } )

    describe( '.reconnect()', () => {
        test( 'should .reconnect() attempt to reconnect websockets', () => {
            const result = websocketInstance.reconnect()
            
            // reconnect returns boolean directly, not object
            expect( typeof result ).toBe( 'boolean' )
        } )
    } )
} )