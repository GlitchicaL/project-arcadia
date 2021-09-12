import {
    EXCHANGE_LOADED,

    CANCELLED_ORDERS_LOADED,
    FILLED_ORDERS_LOADED,
    ALL_ORDERS_LOADED,

    ORDER_CANCELLING,
    ORDER_CANCELLED,
    ORDER_FILLING,
    ORDER_FILLED,

    EXCHANGE_ETHER_BALANCE_LOADED,
    EXCHANGE_TOKEN_BALANCE_LOADED,
    BALANCES_LOADING,
    BALANCES_LOADED,

    TRANSFER_REQUEST,
    TRANSFER_SUCCESS,
    TRANSFER_FAIL,
    TRANSFER_RESET,

    ORDER_MAKING,
    ORDER_MADE
} from '../constants/exchangeConstants';

const exchange = (state = { loaded: false, contract: {}, orderCancelling: false, newOrder: { making: false } }, action) => {
    let index, data

    switch (action.type) {
        case EXCHANGE_LOADED:
            return {
                ...state,
                loaded: true,
                contract: action.exchange
            }

        // ------------------------------------------------------------------------------
        // ORDER CASES (DEPOSIT & WITHDRAWS)

        case CANCELLED_ORDERS_LOADED:
            return {
                ...state,
                cancelledOrders: {
                    loaded: true,
                    data: action.cancelledOrders
                }
            }

        case FILLED_ORDERS_LOADED:
            return {
                ...state,
                filledOrders: {
                    loaded: true,
                    data: action.filledOrders
                }
            }

        case ALL_ORDERS_LOADED:
            return {
                ...state,
                allOrders: {
                    loaded: true,
                    data: action.allOrders
                }
            }

        case ORDER_CANCELLING:
            return {
                ...state,
                orderCancelling: true
            }

        case ORDER_CANCELLED:
            return {
                ...state,
                orderCancelling: false,
                cancelledOrders: {
                    ...state.cancelledOrders,
                    data: [
                        ...state.cancelledOrders.data,
                        action.order
                    ]
                }
            }

        case ORDER_FILLING:
            return {
                ...state,
                orderFilling: true
            }

        case ORDER_FILLED:
            // Prevent duplicate orders
            index = state.filledOrders.data.findIndex(order => order.id === action.order.id)

            if (index === -1) {
                data = [...state.filledOrders.data, action.order]
            } else {
                data = state.filledOrders.data
            }

            return {
                ...state,
                orderFilling: false,
                filledOrders: {
                    ...state.filledOrders,
                    data
                }
            }

        // ------------------------------------------------------------------------------
        // BALANCE CASES (DEPOSIT & WITHDRAWS)

        case EXCHANGE_ETHER_BALANCE_LOADED:
            return {
                ...state,
                etherBalance: action.balance
            }

        case EXCHANGE_TOKEN_BALANCE_LOADED:
            return {
                ...state,
                tokenBalance: action.balance
            }

        case BALANCES_LOADING:
            return {
                ...state,
                balancesLoading: true
            }

        case BALANCES_LOADED:
            return {
                ...state,
                balancesLoading: false
            }

        // ------------------------------------------------------------------------------
        // TRANSFER CASES (DEPOSIT & WITHDRAWS)

        case TRANSFER_REQUEST:
            return {
                ...state,
                transferInProgress: true,
                transferType: action.transferType,
                transferToken: action.transferToken
            }

        case TRANSFER_SUCCESS:
            return {
                ...state,
                transferInProgress: false,
                transferType: action.transferType,
                transferToken: action.transferToken
            }

        case TRANSFER_FAIL:
            return {
                ...state,
                transferInProgress: false,
                transferType: action.transferType,
                transferToken: action.transferToken
            }

        case TRANSFER_RESET:
            return {
                ...state,
                transferInProgress: false,
                transferType: '',
                transferToken: ''
            }

        // ------------------------------------------------------------------------------
        // MAKING ORDERS CASES

        case ORDER_MAKING:
            return {
                ...state,
                newOrder: { ...state.newOrder, amount: action.order.amount, price: action.order.price, making: true }
            }

        case ORDER_MADE:
            // Prevent duplicate orders
            index = state.allOrders.data.findIndex(order => order.id === action.order.id)

            if (index === -1) {
                data = [...state.allOrders.data, action.order]
            } else {
                data = state.allOrders.data
            }

            return {
                ...state,
                allOrders: {
                    ...state.allOrders,
                    data
                },
                newOrder: {
                    ...state.newOrder,
                    making: false
                }
            }

        default:
            return state
    }
}

export default exchange