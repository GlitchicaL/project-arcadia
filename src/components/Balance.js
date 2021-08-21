import { useEffect, useState } from 'react';
import { Card, Spinner, Tabs, Tab, Table, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import TransferForm from './forms/TransferForm';
import BalanceTable from './tables/BalanceTable';

// Import Actions
import { loadBalances, depositEther, withdrawEther, depositToken, withdrawToken } from '../redux/actions/exchangeActions';

const Balance = () => {
    const [ethDepositAmount, setEthDepositAmount] = useState(0)
    const [ethWithdrawAmount, setEthWithdrawAmount] = useState(0)
    const [tokenDepositAmount, setTokenDepositAmount] = useState(0)
    const [tokenWithdrawAmount, setTokenWithdrawAmount] = useState(0)

    const dispatch = useDispatch()

    const web3 = useSelector(state => state.web3)
    const { connection, account, balance: etherBalance } = web3

    const exchange = useSelector(state => state.exchange)
    const { contract: exchangeContract, balancesLoading, etherBalance: exchangeEtherBalance, tokenBalance: exchangeTokenBalance, transferInProgress } = exchange

    const token = useSelector(state => state.token)
    const { contract: tokenContract, balance: tokenBalance } = token

    useEffect(() => {

        const loadExchangeData = async () => {

            // Load balances
            await dispatch(loadBalances(connection, exchangeContract, tokenContract, account))

        }

        // Make sure web3, account, exchange, and token contracts are loaded, then load balances.
        if (connection && exchangeContract && tokenContract && account && !transferInProgress) {
            loadExchangeData()
        }

    }, [dispatch, connection, exchangeContract, tokenContract, account, transferInProgress])

    // DEPOSIT & WITHDRAWL HANDLERS
    const depositEtherHandler = (e) => {
        e.preventDefault()

        dispatch(depositEther(connection, exchangeContract, ethDepositAmount, account))
    }

    const withdrawEtherHandler = (e) => {
        e.preventDefault()

        dispatch(withdrawEther(connection, exchangeContract, ethWithdrawAmount, account))
    }

    const depositTokenHandler = (e) => {
        e.preventDefault()

        dispatch(depositToken(connection, exchangeContract, tokenContract, tokenDepositAmount, account))
    }

    const withdrawTokenHandler = (e) => {
        e.preventDefault()

        dispatch(withdrawToken(connection, exchangeContract, tokenContract, tokenWithdrawAmount, account))
    }

    return (
        <Card className='my-3'>
            <Card.Header>
                Balance
            </Card.Header>
            <Card.Body>
                {balancesLoading || transferInProgress ? (
                    <Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
                ) : (
                    <Tabs defaultActiveKey='deposit' className="mb-3">

                        <Tab eventKey='deposit' title='Deposit'>

                            <BalanceTable />

                            {/* DEPOSIT ETHER FORM */}
                            <TransferForm submitHandler={depositEtherHandler} valueHandler={setEthDepositAmount} tokenType='ETH' transferType='Deposit' />

                            {/* DEPOSIT TOKEN FORM */}
                            <TransferForm submitHandler={depositTokenHandler} valueHandler={setTokenDepositAmount} tokenType='DAPP' transferType='Deposit' />

                        </Tab>

                        <Tab eventKey='withdraw' title='Withdraw'>

                            <BalanceTable />

                            {/* WITHDRAW ETHER FORM */}
                            <TransferForm submitHandler={withdrawEtherHandler} valueHandler={setEthWithdrawAmount} tokenType='ETH' transferType='Withdraw' />

                            {/* WITHDRAW TOKEN FORM */}
                            <TransferForm submitHandler={withdrawTokenHandler} valueHandler={setTokenWithdrawAmount} tokenType='DAPP' transferType='Withdraw' />

                        </Tab>

                    </Tabs>
                )}
            </Card.Body>
        </Card>
    );
}

export default Balance;