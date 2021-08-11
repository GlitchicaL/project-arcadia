import { useState, useEffect } from 'react';
import { Card, Tabs, Tab, Table, Spinner, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { selectAccountFilledOrders, selectOpenOrders, selectAccountOpenOrders } from '../redux/selectors';
import { decorateMyFilledOrders, decorateMyOpenOrders } from '../redux/decorators';

import { cancelOrder } from '../redux/actions/exchangeActions';

const Transactions = () => {
    const [myFilledOrders, setmyFilledOrders] = useState(null)
    const [myOpenOrders, setmyOpenOrders] = useState(null)
    const [myOpenOrdersLoaded, setMyOpenOrdersLoaded] = useState(false)
    const [showMyOpenOrders, setShowMyOpenOrders] = useState(false)

    const dispatch = useDispatch()

    const web3 = useSelector(state => state.web3)
    const { account } = web3

    const exchange = useSelector(state => state.exchange)
    const { contract, allOrders, filledOrders, cancelledOrders, orderCancelling } = exchange

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
            setMyOpenOrdersLoaded(true)

        }

        if (myOpenOrdersLoaded && !orderCancelling) {
            setShowMyOpenOrders(true)
        } else {
            setShowMyOpenOrders(false)
        }


    }, [allOrders, filledOrders, cancelledOrders, account, myOpenOrdersLoaded, orderCancelling])

    const cancelOrderHandler = (order) => {
        dispatch(cancelOrder(contract, order, account))
    }

    return (
        <Card className='my-3'>
            <Card.Header>
                My Transactions
            </Card.Header>
            <Card.Body>
                <Tabs defaultActiveKey="orders" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="trades" title="Trade History">
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
                                            <tr key={order.id} className='table-hover'>
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
                    <Tab eventKey="orders" title="My Orders">
                        {!showMyOpenOrders ? (
                            <Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
                        ) : (
                            <Table size="sm" className='small'>
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>DAPP/ETH</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOpenOrders.map((order) => {
                                        return (
                                            <tr key={order.id} className='table-hover'>
                                                <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenAmount}</td>
                                                <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                                                <td>
                                                    <Button size="sm" className='btn-cancel' onClick={() => cancelOrderHandler(order)}>Cancel</Button>
                                                </td>
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