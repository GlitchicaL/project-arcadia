const exchange = (state = { loaded: false, contract: {} }, action) => {
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return {
                ...state,
                loaded: true,
                contract: action.exchange
            }

        default:
            return state
    }
}

export default exchange