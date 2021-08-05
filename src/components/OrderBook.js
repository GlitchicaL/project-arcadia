import { useState, useEffect } from 'react';
import { Card, Table, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { decorateOrderBookOrders } from '../redux/decorators';
import { selectOpenOrders } from '../redux/selectors';

const OrderBook = () => {
    const [orders, setOrders] = useState(null)

    const exchange = useSelector(state => state.exchange)
    const { allOrders, cancelledOrders, filledOrders } = exchange

    useEffect(() => {

        // Check to see if all order types have been loaded
        if (allOrders && filledOrders && cancelledOrders) {

            // Filter out filled & cancelled orders
            let _orders = selectOpenOrders(allOrders.data, filledOrders.data, cancelledOrders.data)

            // Decorate open orders
            _orders = decorateOrderBookOrders(_orders)

            // Set orders
            setOrders(_orders)

        }

    }, [allOrders, cancelledOrders, filledOrders])

    return (
        <Card>
            <Card.Body className='p-0'>
                {(!orders) ? (
                    <Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
                ) : (
                    <Table size="sm" className='small'>
                        <tbody>
                            {orders.sellOrders.map((order) => {
                                return (
                                    <tr key={order.id}>
                                        <td>{order.tokenAmount}</td>
                                        <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                                        <td>{order.etherAmount}</td>
                                    </tr>
                                )
                            })}

                            <tr>
                                <th>DAPP</th>
                                <th>DAPP/ETH</th>
                                <th>ETH</th>
                            </tr>

                            {orders.buyOrders.map((order) => {
                                return (
                                    <tr key={order.id}>
                                        <td>{order.tokenAmount}</td>
                                        <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                                        <td>{order.etherAmount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
}

export default OrderBook;