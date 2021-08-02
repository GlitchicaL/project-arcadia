import Exchange from '../../abis/Exchange.json';

export const loadExchange = async (web3, networkId, dispatch) => {
    try {
        const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)

        dispatch({ type: 'EXCHANGE_LOADED', exchange })

        return exchange
    } catch (error) {
        window.alert('Contract not deployed to the current network. Please select another network with Metamask')
        return null
    }
}