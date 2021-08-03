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