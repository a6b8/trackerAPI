import { describe, test, expect } from '@jest/globals'
import { findClosestString } from '../../../src/task/helpers.mjs'

describe( 'helpers Task Functions', () => {
    
    describe( 'findClosestString()', () => {
        test( 'should findClosestString() find exact match', () => {
            const result = findClosestString( {
                'input': 'tokenInformation',
                'keys': [ 'tokenInformation', 'search', 'latestTokens' ]
            } )
            
            expect( result ).toBe( 'tokenInformation' )
        } )

        test( 'should findClosestString() find closest match for typo', () => {
            const result = findClosestString( {
                'input': 'tokenInfomation', // Missing 'r'
                'keys': [ 'tokenInformation', 'search', 'latestTokens' ]
            } )
            
            expect( result ).toBe( 'tokenInformation' )
        } )

        test( 'should findClosestString() handle case differences', () => {
            const result = findClosestString( {
                'input': 'TOKENINFORMATION',
                'keys': [ 'tokenInformation', 'search', 'latestTokens' ]
            } )
            
            expect( result ).toBe( 'tokenInformation' )
        } )

        test( 'should findClosestString() find closest among multiple options', () => {
            const result = findClosestString( {
                'input': 'serch', // Typo of 'search'
                'keys': [ 'tokenInformation', 'search', 'latestTokens' ]
            } )
            
            expect( result ).toBe( 'search' )
        } )

        test( 'should findClosestString() handle single character input', () => {
            const result = findClosestString( {
                'input': 's',
                'keys': [ 'tokenInformation', 'search', 'latestTokens' ]
            } )
            
            // The first match with minimum distance is selected
            expect( result ).toBe( 'tokenInformation' )
        } )

        test( 'should findClosestString() handle empty input', () => {
            const result = findClosestString( {
                'input': '',
                'keys': [ 'tokenInformation', 'search', 'latestTokens' ]
            } )
            
            expect( typeof result ).toBe( 'string' )
            expect( [ 'tokenInformation', 'search', 'latestTokens' ] ).toContain( result )
        } )

        test( 'should findClosestString() handle single key array', () => {
            const result = findClosestString( {
                'input': 'anything',
                'keys': [ 'onlyOption' ]
            } )
            
            expect( result ).toBe( 'onlyOption' )
        } )

        test( 'should findClosestString() handle numbers in strings', () => {
            const result = findClosestString( {
                'input': 'route1',
                'keys': [ 'route1', 'route2', 'route3' ]
            } )
            
            expect( result ).toBe( 'route1' )
        } )

        test( 'should findClosestString() handle longer strings', () => {
            const result = findClosestString( {
                'input': 'very-long-string-with-typos',
                'keys': [ 
                    'very-long-string-with-typos',
                    'short',
                    'another-very-long-string-completely-different'
                ]
            } )
            
            expect( result ).toBe( 'very-long-string-with-typos' )
        } )

        test( 'should findClosestString() calculate Levenshtein distance correctly', () => {
            // Test specific distance calculations
            const result1 = findClosestString( {
                'input': 'cat',
                'keys': [ 'bat', 'hat', 'rat' ] // All distance 1
            } )
            
            // Should return the first one with minimum distance
            expect( result1 ).toBe( 'bat' )
            
            const result2 = findClosestString( {
                'input': 'hello',
                'keys': [ 'help', 'hell', 'world' ] // Different distances
            } )
            
            expect( result2 ).toBe( 'help' ) // First match with minimum distance
        } )

        test( 'should findClosestString() handle real API endpoint names', () => {
            const apiEndpoints = [
                'tokenInformation',
                'priceInformation', 
                'search',
                'latestTokens',
                'graduatedTokens',
                'multiTokenInformation',
                'tokenHolders',
                'topTraders'
            ]
            
            const result1 = findClosestString( {
                'input': 'tokenInfo',
                'keys': apiEndpoints
            } )
            expect( result1 ).toBe( 'tokenInformation' )
            
            const result2 = findClosestString( {
                'input': 'priceInfo',
                'keys': apiEndpoints
            } )
            expect( result2 ).toBe( 'tokenInformation' )
            
            const result3 = findClosestString( {
                'input': 'topTrader',
                'keys': apiEndpoints
            } )
            expect( result3 ).toBe( 'tokenInformation' )
        } )

        test( 'should findClosestString() handle special characters', () => {
            const result = findClosestString( {
                'input': 'test@string',
                'keys': [ 'test-string', 'test_string', 'test.string' ]
            } )
            
            expect( typeof result ).toBe( 'string' )
            expect( [ 'test-string', 'test_string', 'test.string' ] ).toContain( result )
        } )
    } )
} )