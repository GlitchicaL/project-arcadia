import { useEffect } from 'react';
import { Tabs, Tab, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// Import Components
import Balance from '../components/Balance';
import Trades from '../components/Trades';
import OrderBook from '../components/OrderBook';
import PriceChart from '../components/PriceChart';
import Transactions from '../components/Transactions';

// Import Actions
import { loadAllOrders, subscribeToEvents } from '../redux/actions/exchangeActions';

const ExchangeScreen = () => {
    const dispatch = useDispatch()

    const exchange = useSelector(state => state.exchange)
    const { contract } = exchange

    useEffect(() => {

        const loadExchangeData = async () => {
            await dispatch(loadAllOrders(contract))
            await dispatch(subscribeToEvents(contract))
        }

        loadExchangeData()

    }, [contract, dispatch])

    return (
        <Row>
            <Col lg={4} xl={6}>

                {/* PRICE CHART */}
                <PriceChart />

                {/* USER TRANSACTION HISTORY */}
                <Transactions />
            </Col>

            {/* ORDER BOOK AND EXCHANGE TRADE HISTORY */}
            <Col lg={4} xl={3}>
                <Card>
                    <Card.Body>
                        <Tabs defaultActiveKey="order-book" id="uncontrolled-tab-example" className='my-2'>
                            <Tab eventKey="order-book" title="Order Book">
                                <OrderBook />
                            </Tab>
                            <Tab eventKey="trades" title="Trades">
                                <Trades />
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Col>

            <Col lg={4} xl={3}>

                {/* USER BALANCE */}
                <Balance />

                {/* CREATE ORDERS */}
                <Card>
                    <Card.Header>
                        New Order
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of the card's content.
                        </Card.Text>
                        <a href="/#" className="card-link">Card link</a>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default ExchangeScreen