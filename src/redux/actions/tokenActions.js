import Token from '../../abis/Token.json';

export const loadToken = (web3, networkId) => async (dispatch) => {
    try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)

        dispatch({ type: 'TOKEN_LOADED', token })

        return token
    } catch (error) {
        console.log('Token not deployed to the current network. Please select another network with Metamask')
        return null
    }
}