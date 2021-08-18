import {
    TOKEN_LOADED,
    TOKEN_BALANCE_LOADED
} from '../constants/tokenConstants';

const token = (state = { loaded: false, contract: {} }, action) => {
    switch (action.type) {
        case TOKEN_LOADED:
            return {
                ...state,
                loaded: true,
                contract: action.token
            }

        case TOKEN_BALANCE_LOADED:
            return {
                ...state,
                balance: action.balance
            }

        default:
            return state
    }
}

export default token