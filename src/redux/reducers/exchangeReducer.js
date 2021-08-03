const exchange = (state = { loaded: false, contract: {} }, action) => {
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return {
                ...state,
                loaded: true,
                contract: action.exchange
            }

        case 'CANCELLED_ORDERS_LOADED':
            return {
                ...state,
                cancelledOrders: {
                    loaded: true,
                    data: action.cancelledOrders
                }
            }

        case 'FILLED_ORDERS_LOADED':
            return {
                ...state,
                filledOrders: {
                    loaded: true,
                    data: action.filledOrders
                }
            }

        case 'ALL_ORDERS_LOADED':
            return {
                ...state,
                allOrders: {
                    loaded: true,
                    data: action.allOrders
                }
            }

        default:
            return state
    }
}

export default exchange