// This script is responsible for

import { create, get, groupBy, reject } from 'lodash';
import { createSelector } from 'reselect';
import moment from 'moment';

import { ETHER_ADDRESS, tokens, ether, GREEN, RED } from '../helpers';

export const selectOpenOrders = (allOrders, filledOrders, cancelledOrders) => {

    const openOrders = reject(allOrders, (order) => {
        const orderFilled = filledOrders.some((o) => o.id === order.id)
        const orderCancelled = cancelledOrders.some((o) => o.id === order.id)
        return (orderFilled || orderCancelled)
    })

    return openOrders
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

// const allOrdersLoaded = state => get(state, 'exchange.allOrders.loaded', false)
// const allOrders = state => get(state, 'exchange.allOrders.data', [])

// const cancelledOrdersLoaded = state => get(state, 'exchange.cancelledOrders.loaded', false)
// export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, loaded => loaded)

// const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', [])
// export const cancelledOrdersSelector = createSelector(cancelledOrders, o => o)

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

// const openOrders = state => {
//     const all = allOrders(state)
//     const cancelled = cancelledOrders(state)
//     const filled = filledOrders(state)

//     const openOrders = reject(all, (order) => {
//         const orderFilled = filled.some((o) => o.id === order.id)
//         const orderCancelled = cancelled.some((o) => o.id === order.id)
//         return (orderFilled || orderCancelled)
//     })

//     return openOrders
// }

// const orderBookLoaded = state => cancelledOrdersLoaded(state) && filledOrdersLoaded(state) && allOrdersLoaded(state)
// export const orderBookSelector = createSelector(
//     openOrders,
//     (orders) => {
//         orders = decorateOrderBookOrders(orders)

//         // Group orders by 'orderType'
//         orders = groupBy(orders, 'orderType')

//         // Fetch buy orders
//         const buyOrders = get(orders, 'buy', [])

//         // Sort buy orders by token price
//         orders = {
//             ...orders,
//             buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
//         }

//         // Fetch sell orders
//         const sellOrders = get(orders, 'sell', [])

//         // Sort sell orders by token price
//         orders = {
//             ...orders,
//             sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
//         }
//         return orders
//     }
// )

// const decorateOrderBookOrders = (orders) => {
//     return (
//         orders.map((order) => {
//             order = decorateOrder(order)
//             order = decorateOrderBookOrder(order)
//             return order
//         })
//     )
// }

// const decorateOrderBookOrder = (order) => {
//     const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'

//     return ({
//         ...order,
//         orderType,
//         orderTypeClass: (orderType === 'buy' ? GREEN : RED),
//         orderFillClass: (orderType === 'buy' ? 'sell' : 'buy')
//     })
// }