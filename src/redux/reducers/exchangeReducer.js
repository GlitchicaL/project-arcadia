const exchange = (state = {}, action) => {
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return {
                ...state,
                contract: action.exchange
            }

        default:
            return state
    }
}

export default exchange