import { useEffect, useState } from 'react';
import { Card, Tabs, Tab, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import OrderForm from './forms/OrderForm';

import { makeBuyOrder, makeSellOrder } from '../redux/actions/exchangeActions';

const NewOrder = () => {
    const [showForm, setShowForm] = useState(true)
    const [buyAmount, setBuyAmount] = useState(0)
    const [buyPrice, setBuyPrice] = useState(0)
    const [sellAmount, setSellAmount] = useState(0)
    const [sellPrice, setsellPrice] = useState(0)

    const dispatch = useDispatch()

    const web3 = useSelector(state => state.web3)
    const { connection, account } = web3

    const exchange = useSelector(state => state.exchange)
    const { contract: exchangeContract, buyOrder, sellOrder } = exchange

    const token = useSelector(state => state.token)
    const { contract: tokenContract } = token

    useEffect(() => {

        setShowForm(!buyOrder.making && !sellOrder.making)

    }, [buyOrder, sellOrder])

    const makeBuyOrderHandler = (e) => {
        e.preventDefault()

        const order = {
            amount: buyAmount,
            price: buyPrice
        }

        dispatch(makeBuyOrder(connection, exchangeContract, tokenContract, order, account))
    }

    const makeSellOrderHandler = (e) => {
        e.preventDefault()

        const order = {
            amount: sellAmount,
            price: sellPrice
        }

        dispatch(makeSellOrder(connection, exchangeContract, tokenContract, order, account))
    }

    return (
        <Card className='my-3'>
            <Card.Header>
                New Order
            </Card.Header>
            <Card.Body>
                <Tabs defaultActiveKey='buy' className="mb-3">

                    <Tab eventKey='buy' title='Buy'>

                        {!showForm ? (
                            <Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
                        ) : (
                            <OrderForm submitHandler={makeBuyOrderHandler} setAmount={setBuyAmount} setPrice={setBuyPrice} orderType={'Buy'} />
                        )}

                        <p><small>Total: {buyAmount * buyPrice} ETH</small></p>

                    </Tab>

                    <Tab eventKey='sell' title='Sell'>

                        {!showForm ? (
                            <Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
                        ) : (
                            <OrderForm submitHandler={makeSellOrderHandler} setAmount={setSellAmount} setPrice={setsellPrice} orderType={'Sell'} />
                        )}

                        <p><small>Total: {sellAmount * sellPrice} ETH</small></p>

                    </Tab>

                </Tabs>
            </Card.Body>
        </Card>
    );
}

export default NewOrder;