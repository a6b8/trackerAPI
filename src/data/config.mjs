const config = {
    'dataUrl': 'https://data.solanatracker.io',
    'swapUrl': 'https://swap-v2.solanatracker.io/swap',
    'websocket': { 
        'reconnectDelay': 2500,
        'reconnectDelayMax': 4500,
        'randomizationFactor': 0.5
    }
}


export { config }