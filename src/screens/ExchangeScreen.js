import { Component } from 'react';
import { Tabs, Tab, Row, Col, Card } from 'react-bootstrap';
import { connect } from 'react-redux';

// Import Actions
import { loadWeb3, loadAccount } from '../redux/actions/web3Actions';
import { loadToken } from '../redux/actions/tokenActions';
import { loadExchange } from '../redux/actions/exchangeActions';

class ExchangeScreen extends Component {
    componentWillMount() {
        this.loadBlockchainData(this.props.dispatch)
    }

    async loadBlockchainData(dispatch) {
        const web3 = loadWeb3(dispatch)

        await window.ethereum.enable();

        const networkId = await web3.eth.net.getId()

        const accounts = await loadAccount(web3, dispatch)

        const token = loadToken(web3, networkId, dispatch)

        loadExchange(web3, networkId, dispatch)
    }

    render() {
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
        )
    }
}

function mapStateToProps(state) {
    return {

    }
}

export default connect(mapStateToProps)(ExchangeScreen)

//export default ExchangeScreen;