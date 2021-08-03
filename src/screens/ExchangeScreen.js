import { useEffect } from 'react';
import { Tabs, Tab, Row, Col, Card, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// Import Actions
import { loadWeb3, loadAccount } from '../redux/actions/web3Actions';
import { loadToken } from '../redux/actions/tokenActions';
import { loadExchange } from '../redux/actions/exchangeActions';

const ExchangeScreen = () => {
    const dispatch = useDispatch()

    const token = useSelector(state => state.token)
    const { loaded: tokenLoaded } = token

    const exchange = useSelector(state => state.exchange)
    const { loaded: exchangeLoaded } = exchange

    useEffect(() => {
        const loadBlockchainData = async () => {
            const web3 = dispatch(loadWeb3())

            await window.ethereum.enable();

            const networkId = await web3.eth.net.getId()

            const accounts = dispatch(loadAccount(web3))
            const token = dispatch(loadToken(web3, networkId))

            if (!token) {
                window.alert('Token not deployed to the current network. Please select another network with Metamask')
                return
            }

            const exchange = dispatch(loadExchange(web3, networkId))

            if (!exchange) {
                window.alert('Exchange not deployed to the current network. Please select another network with Metamask')
                return
            }
        }

        loadBlockchainData()
    }, [dispatch])

    return (
        <div>
            {(tokenLoaded && exchangeLoaded) ? (
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
                        <Card className='my-3'>
                            <Card.Header>
                                My Transactions
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of the card's content.
                                </Card.Text>
                                <a href="/#" className="card-link">Card link</a>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* ORDER BOOK AND EXCHANGE TRADE HISTORY */}
                    <Col lg={3}>
                        <Tabs defaultActiveKey="order-book" id="uncontrolled-tab-example">
                            <Tab eventKey="order-book" title="Order Book">
                                <Card>
                                    <Card.Body>
                                        <Card.Text>
                                            Some quick example text to build on the card title and make up the bulk of the card's content.
                                        </Card.Text>
                                        <a href="/#" className="card-link">Card link</a>
                                    </Card.Body>
                                </Card>
                            </Tab>
                            <Tab eventKey="trades" title="Trades">
                                <Card>
                                    <Card.Body>
                                        <Card.Text>
                                            Some quick example text to build on the card title and make up the bulk of the card's content.
                                        </Card.Text>
                                        <a href="/#" className="card-link">Card link</a>
                                    </Card.Body>
                                </Card>
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
            ) : (
                <Alert>Loading...</Alert>
            )}
        </div>
    )
}

export default ExchangeScreen