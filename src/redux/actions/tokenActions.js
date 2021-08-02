import Token from '../../abis/Token.json';

export const loadToken = async (web3, networkId, dispatch) => {
    try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)

        dispatch({ type: 'TOKEN_LOADED', token })

        return token
    } catch (error) {
        window.alert('Contract not deployed to the current network. Please select another network with Metamask')
        return null
    }
}