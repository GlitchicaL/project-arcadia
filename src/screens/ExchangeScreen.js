import { Component } from 'react';
import { Tabs, Tab, Row, Col, Card } from 'react-bootstrap';

import Web3 from 'web3';
import Token from '../abis/Token.json';

class ExchangeScreen extends Component {
    componentWillMount() {
        this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')

        await window.ethereum.enable();

        const network = await web3.eth.net.getNetworkType()
        const networkId = await web3.eth.net.getId()

        const accounts = await web3.eth.getAccounts()

        console.log('abi', Token.abi)
        console.log('address', Token.networks[networkId].address)

        const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
        const totalSupply = await token.methods.totalSupply().call()

        console.log(token)
        console.log(totalSupply)
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

export default ExchangeScreen;