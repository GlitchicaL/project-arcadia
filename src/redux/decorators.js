// This script is responsible for "decorating" data stored in the Redux store with additional custom attributes.
// Examples of some custom attributes include formatting timestamps, token & ether values into human readable data.

import { get, groupBy, maxBy, minBy } from 'lodash';
import moment from 'moment';

import { ETHER_ADDRESS, tokens, ether, GREEN, RED } from '../helpers';

// INTERNAL FUNCTIONS

const _decorateOrder = (order) => {
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

const _decorateFilledOrder = (order, previousOrder) => {
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

const _decorateOpenOrders = (orders) => {
    // Group orders by 'orderType'
    orders = groupBy(orders, 'orderType')

    // Fetch buy orders
    const buyOrders = get(orders, 'buy', [])

    // Sort buy orders by token price
    orders = {
        ...orders,
        buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
    }

    // Fetch sell orders
    const sellOrders = get(orders, 'sell', [])

    // Sort sell orders by token price
    orders = {
        ...orders,
        sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
    }

    return orders
}

const _decorateOrderBookOrder = (order) => {
    const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'

    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillClass: (orderType === 'buy' ? 'sell' : 'buy')
    })
}

const _decorateMyFilledOrder = (order, account) => {
    const myOrder = order.user === account

    let orderType

    if (myOrder) {
        orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
    } else {
        orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
    }

    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderSign: (orderType === 'buy' ? '+' : '-')
    })
}

const _decorateMyOpenOrder = (order, account) => {
    let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'

    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED)
    })
}

const _decorateGraphData = (orders) => {
    // Group orders by hour for the graph
    orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())

    const hours = Object.keys(orders)

    // Build the graph series
    const graphData = hours.map((hour) => {
        // Fetch all orders from the current hour
        const group = orders[hour]

        // Calculate price values for open, high, low, close
        const open = group[0] // First order
        const high = maxBy(group, 'tokenPrice') // Highest token order
        const low = minBy(group, 'tokenPrice') // Lowest token price
        const close = group[group.length - 1] // Last order


        return ({
            x: new Date(hour),
            y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
        })
    })
    return graphData
}

// EXTERNAL FUNCTIONS

export const decorateFilledOrders = (orders) => {

    // Sort Orders by date ascending for decorating price comparision
    orders = orders.sort((a, b) => a.timestamp - b.timestamp)

    let previousOrder = orders[0]

    // Decorate orders
    orders = orders.map((order) => {
        order = _decorateOrder(order)
        order = _decorateFilledOrder(order, previousOrder)
        previousOrder = order
        return order
    })

    // Sort Orders by date descending for UI display
    orders = orders.sort((a, b) => b.timestamp - a.timestamp)

    return orders
}

export const decorateOrderBookOrders = (orders) => {
    // Decorate orders
    orders = orders.map((order) => {
        order = _decorateOrder(order)
        order = _decorateOrderBookOrder(order)
        return order
    })

    // Decorate & sort buy/sell orders
    orders = _decorateOpenOrders(orders)

    return orders
}

export const decorateMyFilledOrders = (orders, account) => {

    // Sort by date ascending
    orders = orders.sort((a, b) => a.timestamp - b.timestamp)

    orders = orders.map((order) => {
        order = _decorateOrder(order)
        order = _decorateMyFilledOrder(order, account)
        return order
    })

    return orders

}

export const decorateMyOpenOrders = (orders, account) => {

    orders = orders.map((order) => {
        order = _decorateOrder(order)
        order = _decorateMyOpenOrder(order, account)
        return order
    })

    return orders

}

export const decoratePriceChartOrders = (orders) => {
    orders = orders.sort((a, b) => a.timestamp - b.timestamp)

    orders = orders.map((order) => _decorateOrder(order))

    // Get last 2 orders for final price and price change
    let secondLastOrder, lastOrder
    [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)

    const lastPrice = get(lastOrder, 'tokenPrice', 0)
    const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

    return ({
        lastPrice,
        lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
        series: [{
            data: _decorateGraphData(orders)
        }]
    })
}

