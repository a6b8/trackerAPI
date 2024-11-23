function findClosestString( { input, keys } ) {
    function distance( a, b ) {
        let dp = Array( a.length + 1 )
                .fill( null )
                .map( () => Array( b.length + 1 )
                .fill( 0 )
            )
            .map( ( z, index, all ) => {
                index === 0 ? z = z.map( ( y, rindex ) => rindex ) : ''
                z[ 0 ] = index 
                return z
            } )

        dp = dp
            .map( ( z, i ) => {
                return z.map( ( y, j ) => {
                    if( i > 0 && j > 0 ) {
                        if( a[ i - 1 ] === b[ j - 1 ] ) {
                            y = dp[ i - 1 ][ j - 1 ]
                        } else {
                            const min = Math.min(
                                dp[ i - 1 ][ j ], 
                                dp[ i ][ j - 1 ], 
                                dp[ i - 1 ][ j - 1 ]
                            )
                            y = 1 + min
                        }
                    }
                    return y
                } )
            } )

        return dp[ a.length ][ b.length ]
    }


    const result = keys
        .reduce( ( acc, key, index ) => {
            const currentDistance = distance( input, key )
            if( index === 0 ) {
                acc = {
                    'closestKey': key,
                    'closestDistance': currentDistance
                }
            }
            
            if( currentDistance < acc['closestDistance'] ) {
                acc['closestKey'] = key;
                acc['closestDistance'] = currentDistance;
            }

            return acc
        }, {} )

    return result['closestKey']
}


export { findClosestString }