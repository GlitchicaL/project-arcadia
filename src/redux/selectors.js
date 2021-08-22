// This script is responsible for "selecting" specific data stored in the Redux store
// An example includes filtering through open orders owned by an account

import { reject } from 'lodash';

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