import Exchange from '../../abis/Exchange.json';

export const loadExchange = (web3, networkId) => async (dispatch) => {
    try {
        const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)

        dispatch({ type: 'EXCHANGE_LOADED', exchange })

        return exchange
    } catch (error) {
        console.log('Exchange not deployed to the current network. Please select another network with Metamask')
        return null
    }
}

export const loadAllOrders = (exchange) => async (dispatch) => {
    // Fetch canceled orders
    const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' })
    const cancelledOrders = cancelStream.map(event => event.returnValues)

    dispatch({ type: 'CANCELLED_ORDERS_LOADED', cancelledOrders })

    // Fetch filled orders
    const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })
    const filledOrders = tradeStream.map(event => event.returnValues)

    dispatch({ type: 'FILLED_ORDERS_LOADED', filledOrders })

    // Fetch all orders
    const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' })
    const allOrders = orderStream.map(event => event.returnValues)

    dispatch({ type: 'ALL_ORDERS_LOADED', allOrders })
}