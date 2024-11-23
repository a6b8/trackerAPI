import { SolanaTracker } from './task/SolanaTracker.mjs'
import { endpoints } from './data/endpoints.mjs '

const examples = Object
    .entries( endpoints )
    .reduce( ( acc, [ key, value ], index ) => {
        acc[ key ] = { 'route': key, 'params': value['example'] }
        return acc
    }, {} )

export { SolanaTracker, examples }