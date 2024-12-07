import { DataWebsocket } from '../src/task/Websocket.mjs'


const wsUrl = 'wss://ws.blockchain.info/inv'
const dw = new DataWebsocket( { wsUrl } )
// dw.joinRoom( 'transaction' )
// dw.on( 'transaction', console.log )