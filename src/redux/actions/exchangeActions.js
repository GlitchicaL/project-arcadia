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
import { ETHER_BALANCE_LOADED } from '../constants/web3Constants';
import { TOKEN_BALANCE_LOADED } from '../constants/tokenConstants';

import Exchange from '../../abis/Exchange.json';
import { ETHER_ADDRESS, formatBalance } from '../../helpers';

export const loadExchange = (web3, networkId) => async (dispatch) => {
    try {

        const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
        dispatch({ type: EXCHANGE_LOADED, exchange })

        return exchange

    } catch (error) {

        console.log('Exchange not deployed to the current network. Please select another network with Metamask')
        return null

    }
}

export const loadAllOrders = (exchange) => async (dispatch) => {

    // Fetch canceled orders
    const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' })
    const cancelledOrders = cancelStream.map(event => event.returnValues)

    dispatch({ type: CANCELLED_ORDERS_LOADED, cancelledOrders })

    // Fetch filled orders
    const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })
    const filledOrders = tradeStream.map(event => event.returnValues)

    dispatch({ type: FILLED_ORDERS_LOADED, filledOrders })

    // Fetch all orders
    const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' })
    const allOrders = orderStream.map(event => event.returnValues)

    dispatch({ type: ALL_ORDERS_LOADED, allOrders })

}

export const subscribeToEvents = (exchange) => async (dispatch) => {

    exchange.events.Cancel({}, (error, event) => {
        const order = event.returnValues
        dispatch({ type: ORDER_CANCELLED, order })
    })

    exchange.events.Trade({}, (error, event) => {
        const order = event.returnValues
        dispatch({ type: ORDER_FILLED, order })
    })

    exchange.events.Deposit({}, (error, event) => {
        dispatch({ type: TRANSFER_RESET })
    })

    exchange.events.Withdraw({}, (error, event) => {
        dispatch({ type: TRANSFER_RESET })
    })

    exchange.events.Order({}, (error, event) => {
        const order = event.returnValues
        dispatch({ type: ORDER_MADE, order })
    })

}

export const cancelOrder = (exchange, order, account) => async (dispatch) => {

    exchange.methods.cancelOrder(order.id).send({ from: account })
        .on('transactionHash', (hash) => {

            dispatch({ type: ORDER_CANCELLING })

        })
        .on('error', (error) => {

            console.log(error)
            window.alert('There was an error')

        })

}

export const fillOrder = (exchange, order, account) => async (dispatch) => {

    exchange.methods.fillOrder(order.id).send({ from: account })
        .on('transactionHash', (hash) => {

            dispatch({ type: ORDER_FILLING })

        })
        .on('error', (error) => {

            console.log(error)
            window.alert('There was an error')

        })

}

export const loadBalances = (web3, exchange, token, account) => async (dispatch) => {

    dispatch({ type: BALANCES_LOADING })

    // Ether balance in account's wallet
    const etherBalance = await web3.eth.getBalance(account)
    dispatch({ type: ETHER_BALANCE_LOADED, balance: formatBalance(etherBalance) })

    // Token balance in account's wallet
    const tokenBalance = await token.methods.balanceOf(account).call()
    dispatch({ type: TOKEN_BALANCE_LOADED, balance: formatBalance(tokenBalance) })

    // Ether balance in exchange contract
    const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
    dispatch({ type: EXCHANGE_ETHER_BALANCE_LOADED, balance: formatBalance(exchangeEtherBalance) })

    // Token balance in exchange contract
    const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call()
    dispatch({ type: EXCHANGE_TOKEN_BALANCE_LOADED, balance: formatBalance(exchangeTokenBalance) })

    dispatch({ type: BALANCES_LOADED })
}

export const depositEther = (web3, exchange, amount, account) => async (dispatch) => {

    const transferType = 'DEPOSIT'
    const transferToken = 'ETH'

    dispatch({ type: TRANSFER_REQUEST, transferType, transferToken })

    exchange.methods.depositEther().send({ from: account, value: web3.utils.toWei(amount, 'ether') })
        .on('transactionHash', (hash) => {

            dispatch({ type: TRANSFER_SUCCESS, transferType, transferToken })

        })
        .on('error', (error) => {

            console.error(error)
            window.alert(`There was an error!`)

            dispatch({ type: TRANSFER_FAIL, transferType, transferToken })

        })
}

export const withdrawEther = (web3, exchange, amount, account) => async (dispatch) => {

    const transferType = 'WITHDRAW'
    const transferToken = 'ETH'

    dispatch({ type: TRANSFER_REQUEST, transferType, transferToken })

    exchange.methods.withdrawEther(web3.utils.toWei(amount, 'ether')).send({ from: account })
        .on('transactionHash', (hash) => {

            dispatch({ type: TRANSFER_SUCCESS, transferType, transferToken })

        })
        .on('error', (error) => {

            console.error(error)
            window.alert(`There was an error!`)

            dispatch({ type: TRANSFER_FAIL, transferType, transferToken })

        })
}

export const depositToken = (web3, exchange, token, amount, account) => async (dispatch) => {

    const transferType = 'DEPOSIT'
    const transferToken = 'DAPP'

    dispatch({ type: TRANSFER_REQUEST, transferType, transferToken })

    amount = web3.utils.toWei(amount, 'ether')

    token.methods.approve(exchange.options.address, amount).send({ from: account })
        .on('transactionHash', (hash) => {

            exchange.methods.depositToken(token.options.address, amount).send({ from: account })
                .on('transactionHash', (hash) => {

                    dispatch({ type: TRANSFER_SUCCESS, transferType, transferToken })

                })
                .on('error', (error) => {

                    console.error(error)
                    window.alert(`There was an error!`)

                    dispatch({ type: TRANSFER_FAIL, transferType, transferToken })

                })

        })
}

export const withdrawToken = (web3, exchange, token, amount, account) => async (dispatch) => {

    const transferType = 'WITHDRAW'
    const transferToken = 'DAPP'

    dispatch({ type: TRANSFER_REQUEST, transferType, transferToken })

    exchange.methods.withdrawToken(token.options.address, web3.utils.toWei(amount, 'ether')).send({ from: account })
        .on('transactionHash', (hash) => {

            dispatch({ type: TRANSFER_SUCCESS, transferType, transferToken })

        })
        .on('error', (error) => {

            console.error(error)
            window.alert(`There was an error!`)

            dispatch({ type: TRANSFER_FAIL, transferType, transferToken })

        })

}

export const makeBuyOrder = (web3, exchange, token, order, account) => async (dispatch) => {
    const tokenGet = token.options.address
    const amountGet = web3.utils.toWei(order.amount, 'ether')
    const tokenGive = ETHER_ADDRESS
    const amountGive = web3.utils.toWei((order.amount * order.price).toString(), 'ether')

    exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
        .on('transactionHash', (hash) => {
            dispatch({ type: ORDER_MAKING })
        })
        .on('error', (error) => {
            console.log(error)
            window.alert(error)
        })
}

export const makeSellOrder = (web3, exchange, token, order, account) => async (dispatch) => {
    const tokenGet = ETHER_ADDRESS
    const amountGet = web3.utils.toWei((order.amount * order.price).toString(), 'ether')
    const tokenGive = token.options.address
    const amountGive = web3.utils.toWei(order.amount, 'ether')

    exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
        .on('transactionHash', (hash) => {
            dispatch({ type: ORDER_MAKING })
        })
        .on('error', (error) => {
            console.log(error)
            window.alert(error)
        })
}

