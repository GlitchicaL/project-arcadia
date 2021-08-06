import { useEffect } from 'react';
import { Tabs, Tab, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// Import Components
import Trades from '../components/Trades';
import OrderBook from '../components/OrderBook';
import Transactions from '../components/Transactions';

// Import Actions
import { loadAllOrders } from '../redux/actions/exchangeActions';

const ExchangeScreen = () => {
    const dispatch = useDispatch()

    const exchange = useSelector(state => state.exchange)
    const { contract } = exchange

    useEffect(() => {
        dispatch(loadAllOrders(contract))
    }, [contract, dispatch])

    return (
        <Row>
            <Col>

                {/* PRICE CHART */}
                <Card className='my-3'>
                    <Card.Header>
                        Price Chart
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of the card's content.
                        </Card.Text>
                        <a href="/#" className="card-link">Card link</a>
                    </Card.Body>
                </Card>

                {/* USER TRANSACTION HISTORY */}
                <Transactions />
            </Col>

            {/* ORDER BOOK AND EXCHANGE TRADE HISTORY */}
            <Col lg={3}>
                <Tabs defaultActiveKey="order-book" id="uncontrolled-tab-example">
                    <Tab eventKey="order-book" title="Order Book">
                        <OrderBook />
                    </Tab>
                    <Tab eventKey="trades" title="Trades">
                        <Trades />
                    </Tab>
                </Tabs>
            </Col>

            <Col lg={3}>

                {/* USER BALANCE */}
                <Card>
                    <Card.Header>
                        Balance
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of the card's content.
                        </Card.Text>
                        <a href="/#" className="card-link">Card link</a>
                    </Card.Body>
                </Card>

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