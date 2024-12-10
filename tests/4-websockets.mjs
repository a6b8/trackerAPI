import { DataWebsocket } from '../src/task/Websocket2.mjs'
import { getEnv } from './helpers/utils.mjs'

const { wsUrl } = getEnv( {
    'path': '../../../.env',
    'selection': [ [ 'wsUrl', 'SOLANA_TRACKER_DATASTREAM' ] ]
} )


const ws = new DataWebsocket( { wsUrl } )


const tokenId = `6VJ4xpy2NwG5hPpFoqU7HCFqk1QbQG52rQ17ZrQzNaVM`
const poolId = 'GmJaZvdNptvofC4qe3tvuBNgqLm65p1of5pk6JFHpump'


let roomId = `latestTokensPools`
const params = { poolId } 


ws.updateRoom( { roomId, 'type': 'join', params } )

/*
ws.on( room, (data) => {
  console.log('Latest token/pool update:', JSON.stringify(data, null, 2));
});
*/