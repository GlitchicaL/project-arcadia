import Web3 from 'web3';

import {
    WEB3_LOADED,
    WEB3_ACCOUNT_LOADED
} from '../constants/web3Constants';

export const loadWeb3 = () => (dispatch) => {
    const connection = new Web3(Web3.givenProvider || 'http://localhost:7545')

    dispatch({ type: WEB3_LOADED, connection })

    return connection
}

export const loadAccount = (web3) => async (dispatch) => {
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]

    dispatch({ type: WEB3_ACCOUNT_LOADED, account })

    return account
}

