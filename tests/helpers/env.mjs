import { config as defaultConfig } from '../../src/data/config.mjs'
import { rooms } from '../../src/data/rooms.mjs'

/**
 * Get test configuration based on environment
 * - Local development: Use real config from src/data/config.mjs
 * - CI/GitHub Actions: Use mock configuration for testing
 */
export function getTestConfig() {
    if (process.env.NODE_ENV === 'test' && process.env.CI) {
        // GitHub Actions: Mock configuration
        return getMockConfig()
    } else {
        // Local development: Real configuration
        return getRealConfig()
    }
}

/**
 * Get real configuration from source files
 */
function getRealConfig() {
    return {
        ...defaultConfig,
        // Add any additional test-specific overrides here if needed
        websocket: {
            ...defaultConfig.websocket,
            socketNames: [ 'main', 'transaction' ]
        }
    }
}

/**
 * Get mock configuration for CI environments
 */
function getMockConfig() {
    return {
        data: {
            rootUrl: 'https://mock-api.test.com'
        },
        swap: {
            eventPrefix: 'swap',
            rootUrl: 'https://mock-swap.test.com',
            eventStates: {
                'getSwapQuote': [ 'startGetQuote', 'endGetQuote' ],
                'postSwapTransaction': [ 'startPostTransaction', 'endPostTransaction' ],
                'confirmationSignature': [ 'startConfirmTransaction', 'endConfirmTransaction' ]
            },
            wsConfirmationsLevels: [
                { 'commitment': 'processed', 'eventStatus': 'nodeProcessed' },
                { 'commitment': 'confirmed', 'eventStatus': 'nodeConfirmed' },
                { 'commitment': 'finalized', 'eventStatus': 'nodeFinalized' }
            ]
        },
        websocket: {
            reconnectDelay: 2500,
            reconnectDelayMax: 4500,
            randomizationFactor: 0.5,
            socketNames: [ 'main', 'transaction' ]
        }
    }
}

/**
 * Get test-safe room IDs that exist in rooms.mjs
 */
export function getValidRoomIds() {
    return Object.keys( rooms.rooms || {} )
}

/**
 * Get first valid room ID for testing
 */
export function getTestRoomId() {
    const validRooms = getValidRoomIds()
    return validRooms.length > 0 ? validRooms[0] : 'graduatingTokens'
}

/**
 * Check if we're running in CI environment
 */
export function isCIEnvironment() {
    return process.env.NODE_ENV === 'test' && process.env.CI
}

/**
 * Get environment-appropriate API key for testing
 */
export function getTestApiKey() {
    if (isCIEnvironment()) {
        return 'mock-api-key-for-ci'
    }
    // Try to get from environment, fallback to test key
    return process.env.SOLANA_TRACKER_API_KEY || 'test-api-key'
}

/**
 * Get environment-appropriate RPC URLs for testing
 */
export function getTestRpcUrls() {
    if (isCIEnvironment()) {
        return {
            nodeHttp: 'https://mock-rpc.test.com',
            nodeWs: 'wss://mock-ws.test.com'
        }
    }
    return {
        nodeHttp: process.env.SOLANA_HTTP_RPC || 'https://test-rpc.com',
        nodeWs: process.env.SOLANA_WS_RPC || 'wss://test-ws.com'
    }
}

/**
 * Get environment-appropriate WebSocket URL for testing
 */
export function getTestWebSocketUrl() {
    if (isCIEnvironment()) {
        return 'wss://mock-tracker-ws.test.com'
    }
    return process.env.TRACKER_WEBSOCKET_URL || 'wss://test-websocket.com'
}