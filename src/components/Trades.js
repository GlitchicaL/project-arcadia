// This component is responsible for showing all filled orders

import { useState } from 'react';
import { useEffect } from 'react';
import { Card, Table, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { decorateOrder, decorateFilledOrder } from '../redux/selectors';

const Trades = () => {
    const [orders, setOrders] = useState(null)

    const exchange = useSelector(state => state.exchange)
    const { filledOrders } = exchange

    useEffect(() => {
        if (filledOrders) {
            let _orders = filledOrders.data

            // Sort Orders by date ascending for decorating price comparision
            _orders.sort((a, b) => a.timestamp - b.timestamp)

            let previousOrder = _orders[0]

            // Decorate orders
            _orders = filledOrders.data.map((order) => {
                order = decorateOrder(order)
                order = decorateFilledOrder(order, previousOrder)
                previousOrder = order
                return order
            })

            // Sort Orders by date descending for UI display
            _orders.sort((a, b) => b.timestamp - a.timestamp)

            setOrders(_orders)
        }
    }, [filledOrders])

    return (
        <Card>
            <Card.Body>
                {(!orders) ? (
                    <Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
                ) : (
                    <Table size="sm" className='small'>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>DAPP</th>
                                <th>DAPP/ETH</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                return (
                                    <tr key={order.id}>
                                        <td>{order.formattedTimestamp}</td>
                                        <td>{order.tokenAmount}</td>
                                        <td style={{ color: `${order.tokenPriceClass}` }}>{order.tokenPrice}</td>
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

export default Trades;