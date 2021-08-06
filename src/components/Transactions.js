import { useState, useEffect } from 'react';
import { Card, Tabs, Tab, Table, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { selectAccountFilledOrders, selectOpenOrders, selectAccountOpenOrders } from '../redux/selectors';
import { decorateMyFilledOrders, decorateMyOpenOrders } from '../redux/decorators';

const Transactions = () => {
    const [myFilledOrders, setmyFilledOrders] = useState(null)
    const [myOpenOrders, setmyOpenOrders] = useState(null)

    const web3 = useSelector(state => state.web3)
    const { account } = web3

    const exchange = useSelector(state => state.exchange)
    const { allOrders, filledOrders, cancelledOrders } = exchange

    useEffect(() => {
        if (allOrders && filledOrders && cancelledOrders && account) {

            // Account Filled Orders
            let _myFilledOrders = selectAccountFilledOrders(filledOrders.data, account)
            _myFilledOrders = decorateMyFilledOrders(_myFilledOrders, account)
            setmyFilledOrders(_myFilledOrders)

            // Account Open Orders
            let openOrders = selectOpenOrders(allOrders.data, filledOrders.data, cancelledOrders.data)
            let _myOpenOrders = selectAccountOpenOrders(openOrders, account)
            _myOpenOrders = decorateMyOpenOrders(_myOpenOrders, account)
            setmyOpenOrders(_myOpenOrders)

        }
    }, [allOrders, filledOrders, cancelledOrders, account])

    return (
        <Card className='my-3'>
            <Card.Header>
                My Transactions
            </Card.Header>
            <Card.Body>
                <Tabs defaultActiveKey="orders" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="trades" title="Trades">
                        {!myFilledOrders ? (
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
                                    {myFilledOrders.map((order) => {
                                        return (
                                            <tr key={order.id}>
                                                <td>{order.formattedTimestamp}</td>
                                                <td style={{ color: `${order.orderTypeClass}` }}>{order.orderSign}{order.tokenAmount}</td>
                                                <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        )}
                    </Tab>
                    <Tab eventKey="orders" title="Orders">
                        {!myOpenOrders ? (
                            <Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
                        ) : (
                            <Table size="sm" className='small'>
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>DAPP/ETH</th>
                                        <th>Cancel</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOpenOrders.map((order) => {
                                        return (
                                            <tr key={order.id}>
                                                <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenAmount}</td>
                                                <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                                                <td>X</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        )}
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
}

export default Transactions;