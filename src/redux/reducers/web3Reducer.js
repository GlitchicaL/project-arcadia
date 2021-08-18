import {
    WEB3_LOADED,
    WEB3_ACCOUNT_LOADED,

    ETHER_BALANCE_LOADED
} from '../constants/web3Constants';

const web3 = (state = {}, action) => {
    switch (action.type) {
        case WEB3_LOADED:
            return {
                ...state,
                connection: action.connection
            }

        case WEB3_ACCOUNT_LOADED:
            return {
                ...state,
                account: action.account
            }

        case ETHER_BALANCE_LOADED:
            return {
                ...state,
                balance: action.balance
            }

        default:
            return state
    }
}

export default web3