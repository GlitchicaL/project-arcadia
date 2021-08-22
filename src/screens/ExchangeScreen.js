import { useEffect } from 'react';
import { Tabs, Tab, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// Import Components
import Balance from '../components/Balance';
import Trades from '../components/Trades';
import OrderBook from '../components/OrderBook';
import PriceChart from '../components/PriceChart';
import Transactions from '../components/Transactions';
import NewOrder from '../components/NewOrder';

// Import Actions
import { loadAllOrders, subscribeToEvents } from '../redux/actions/exchangeActions';

const ExchangeScreen = () => {
    const dispatch = useDispatch()

    const exchange = useSelector(state => state.exchange)
    const { contract } = exchange

    useEffect(() => {

        document.title = 'Exchange | Project Arcadia'

        const loadExchangeData = async () => {
            await dispatch(loadAllOrders(contract))
            await dispatch(subscribeToEvents(contract))
        }

        loadExchangeData()

    }, [contract, dispatch])

    return (
        <div>
            <Row>
                <Col md={6} lg={7} xl={7} xxl={8}>

                    {/* PRICE CHART */}
                    <PriceChart />

                </Col>

                {/* ORDER BOOK AND EXCHANGE TRADE HISTORY */}
                <Col md={6} lg={5} xl={5} xxl={4}>
                    <Card className='my-3'>
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

                <Col md={6} lg={6} xl={4}>

                    {/* CREATE ORDERS */}
                    <NewOrder />

                </Col>

                <Col md={6} lg={6} xl={4}>

                    {/* USER BALANCE */}
                    <Balance />

                </Col>

                <Col lg={12} xl={4}>

                    {/* USER TRANSACTION HISTORY */}
                    <Transactions />

                </Col>
            </Row>
        </div>
    )
}

export default ExchangeScreen