import { useState, useEffect } from 'react';
import { Table, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { decorateOrderBookOrders } from '../redux/decorators';
import { selectOpenOrders } from '../redux/selectors';
import { fillOrder } from '../redux/actions/exchangeActions';

const OrderBook = () => {
    const [orders, setOrders] = useState(null)
    const [orderBookLoaded, setorderBookLoaded] = useState(false)
    const [showOrderBook, setshowOrderBook] = useState(false)

    const dispatch = useDispatch()

    const web3 = useSelector(state => state.web3)
    const { account } = web3

    const exchange = useSelector(state => state.exchange)
    const { contract, allOrders, filledOrders, cancelledOrders, orderFilling } = exchange

    useEffect(() => {

        // Check to see if all order types have been loaded
        if (allOrders && filledOrders && cancelledOrders) {

            // Filter out filled & cancelled orders
            let _orders = selectOpenOrders(allOrders.data, filledOrders.data, cancelledOrders.data)

            // Decorate open orders
            _orders = decorateOrderBookOrders(_orders)

            // Set orders
            setOrders(_orders)
            setorderBookLoaded(true)

        }

        if (orderBookLoaded && !orderFilling) {
            setshowOrderBook(true)
        } else {
            setshowOrderBook(false)
        }

    }, [allOrders, filledOrders, cancelledOrders, account, orderBookLoaded, orderFilling])

    const fillOrderHandler = (order) => {
        dispatch(fillOrder(contract, order, account))
    }

    return (
        <div>
            {(!showOrderBook) ? (
                <Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
            ) : (
                <Table size="sm" className='small'>
                    <tbody>
                        {orders.sellOrders.map((order) => {
                            return (
                                <OverlayTrigger
                                    key={order.id}
                                    placement='left'
                                    overlay={
                                        <Tooltip id={order.id}>
                                            {`Click here to ${order.orderFillClass}`}
                                        </Tooltip>
                                    }
                                >
                                    <tr className='table-hover pointer' onClick={() => fillOrderHandler(order)}>
                                        <td>{order.tokenAmount}</td>
                                        <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                                        <td>{order.etherAmount}</td>
                                    </tr>
                                </OverlayTrigger>
                            )
                        })}

                        <tr>
                            <th>DAPP</th>
                            <th>DAPP/ETH</th>
                            <th>ETH</th>
                        </tr>

                        {orders.buyOrders.map((order) => {
                            return (
                                <OverlayTrigger
                                    key={order.id}
                                    placement='left'
                                    overlay={
                                        <Tooltip id={order.id}>
                                            {`Click here to ${order.orderFillClass}`}
                                        </Tooltip>
                                    }
                                >
                                    <tr className='table-hover pointer' onClick={() => fillOrderHandler(order)}>
                                        <td>{order.tokenAmount}</td>
                                        <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                                        <td>{order.etherAmount}</td>
                                    </tr>
                                </OverlayTrigger>
                            )
                        })}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default OrderBook;