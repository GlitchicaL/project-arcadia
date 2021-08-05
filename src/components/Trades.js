// This component is responsible for showing all filled orders

import { useState, useEffect } from 'react';
import { Card, Table, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { decorateFilledOrders } from '../redux/decorators';

const Trades = () => {
    const [orders, setOrders] = useState(null)

    const exchange = useSelector(state => state.exchange)
    const { filledOrders } = exchange

    useEffect(() => {
        if (filledOrders) {

            let _orders = decorateFilledOrders(filledOrders.data)
            setOrders(_orders)

        }
    }, [filledOrders])

    return (
        <Card>
            <Card.Body className='p-0'>
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