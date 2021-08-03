import { get } from 'lodash';
import { createSelector } from 'reselect';
import moment from 'moment';

import { ETHER_ADDRESS, tokens, ether, GREEN, RED } from '../helpers';

export const decorateOrder = (order) => {
    let etherAmount
    let tokenAmount

    // If tokenGive is an Ether address
    if (order.tokenGive === ETHER_ADDRESS) {
        etherAmount = order.amountGive
        tokenAmount = order.amountGet
    } else {
        etherAmount = order.amountGet
        tokenAmount = order.amountGive
    }

    // Calculate token price to 5 decimal places
    const precision = 100000
    let tokenPrice = (etherAmount / tokenAmount)
    tokenPrice = Math.round(tokenPrice * precision) / precision

    return ({
        ...order,
        etherAmount: ether(etherAmount),
        tokenAmount: tokens(tokenAmount),
        tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ss a M/D')
    })
}

export const decorateFilledOrder = (order, previousOrder) => {
    let color

    // Show green price if order price is higher than previous order
    // Show red price is order price is lower than previous order
    if (previousOrder.id === order.id) {
        color = GREEN
    } else if (previousOrder.tokenPrice <= order.tokenPrice) {
        color = GREEN
    } else {
        color = RED
    }

    return ({
        ...order,
        tokenPriceClass: color
    })
}

// NOTE: The code below is only for reference alongside the blockchain developer bootcamp and will be removed in a future commit

// const account = state => get(state, 'web3.account')
// export const accountSelector = createSelector(account, a => a)

// const tokenLoaded = state => get(state, 'token.loaded', false)
// export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

// const exchangeLoaded = state => get(state, 'exchange.loaded', false)
// export const exchangeSelector = createSelector(exchangeLoaded, el => el)

// export const contractLoadedSelector = createSelector(
//     tokenLoaded,
//     exchangeLoaded,
//     (tl, el) => (tl && el)
// )

// const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
// export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

// const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
// export const filledOrdersSelector = createSelector(filledOrders, (orders) => {
//     // Sort Orders by date ascending for price comparision
//     orders.sort((a, b) => a.timestamp - b.timestamp)

//     // Decorate the orders
//     orders = decorateFilledOrders(orders)

//     // Sort orders by timestamp
//     orders.sort((a, b) => b.timestamp - a.timestamp)
// })

// const decorateFilledOrders = (orders) => {
//     let previousOrder = orders[0]

//     return (
//         orders.map((order) => {
//             order = decorateOrder(order)
//             order = decorateFilledOrder(order, previousOrder)
//             previousOrder = order
//             return order
//         })
//     )
// }