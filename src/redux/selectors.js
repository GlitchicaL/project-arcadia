// This script is responsible for "selecting" specific data stored in the Redux store
// An example includes filtering through open orders owned by an account

import { create, get, groupBy, maxBy, minBy, reject } from 'lodash';
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

export const selectAccountFilledOrders = (filledOrders, account) => {
    // Find user orders
    let orders = filledOrders.filter((o) => o.user === account || o.userFill === account)
    return orders
}

export const selectAccountOpenOrders = (openOrders, account) => {
    // Filter orders created by current account
    openOrders = openOrders.filter((o) => o.user === account)
    return openOrders
}


// NOTE: The code below is only for reference alongside the blockchain developer bootcamp and will be removed in a future commit

// const decorateOrder = () => { return }
// const decorateFilledOrder = () => { return }

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

// const myFilledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

// const myFilledOrdersSelector = createSelector(
//     account,
//     filledOrders,
//     (account, orders => {
//         // Find user orders
//         orders = orders.filter((o) => o.user === account || o.userFill === account)

//         // Sort by date ascending
//         orders = orders.sort((a, b) => a.timestamp - b.timestamp)

//         orders = decorateMyFilledOrders(orders, account)

//         return orders
//     })
// )

// const decorateMyFilledOrders = (orders, account) => {
//     return (
//         orders.map((order) => {
//             order = decorateOrder(order)
//             order = decorateMyFilledOrder(order, account)
//             return order
//         })
//     )
// }

// const decorateMyFilledOrder = (order, account) => {
//     const myOrder = order.user === account

//     let orderType

//     if (myOrder) {
//         orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
//     } else {
//         orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
//     }

//     return ({
//         ...order,
//         orderType,
//         orderTypeClass: (orderType === 'buy' ? GREEN : RED),
//         orderSign: (orderType === 'buy' ? '+' : '-')
//     })
// }

// export const myOpenOrdersLoadedSelector = createSelector(orderBookLoaded, loaded => loaded)

// export const myOpenOrdersSelector = createSelector(
//     account,
//     openOrders,
//     (account, orders) => {
//         // Filter orders created by current account
//         orders = orders.filter((o) => o.user === account)

//         // Decorate orders
//         orders = decorateMyOpenOrders(orders)

//         // Sort orders by descending 
//         orders = orders.sort((a, b) => b.timestamp - a.timestamp)

//         return orders
//     }
// )

// const decorateMyOpenOrders = (orders, account) => {
//     return (
//         orders.map((order) => {
//             order = decorateOrder(order)
//             order = decorateMyOpenOrder(order)
//             return order
//         })
//     )
// }

// const decorateMyOpenOrder = (order, account) => {
//     let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'

//     return ({
//         ...order,
//         orderType,
//         orderTypeClass: (orderType === 'buy' ? GREEN : RED)
//     })
// }

// export const priceChartLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

// export const priceChartSelector = createSelector(
//     filledOrders,
//     (orders) => {
//         orders = orders.sort((a, b) => a.timestamp - b.timestamp)

//         orders = orders.map((o) => decorateOrder(o))

//         // Get last 2 orders for final price and price change
//         let secondLastOrder, lastOrder
//         [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)

//         const lastPrice = get(lastOrder, 'tokenPrice', 0)
//         const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

//         return ({
//             lastPrice,
//             lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
//             series: [{
//                 data: buildGraphData(orders)
//             }]
//         })
//     }
// )

// const buildGraphData = (orders) => {
//     // Group orders by hour for the graph
//     orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())

//     const hours = Object.keys(orders)

//     // Build the graph series
//     const graphData = hours.map((hour) => {
//         // Fetch all orders from the current hour
//         const group = orders[hour]

//         // Calculate price values for open, high, low, close
//         const open = group[0] // First order
//         const high = maxBy(group, 'tokenPrice') // Highest token order
//         const low = minBy(group, 'tokenPrice') // Lowest token price
//         const close = group[group.length - 1] // Last order


//         return ({
//             x: new Date(hour),
//             y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
//         })
//     })
//     return graphData
// }

// const orderCancelling = state => get(state, 'exchange.orderCancelling', false)
// export const orderCancellingSelector = createSelector(orderCancelling, status => status)