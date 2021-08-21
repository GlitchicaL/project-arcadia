import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const BalanceTable = () => {

    const web3 = useSelector(state => state.web3)
    const { balance: etherBalance } = web3

    const exchange = useSelector(state => state.exchange)
    const { etherBalance: exchangeEtherBalance, tokenBalance: exchangeTokenBalance } = exchange

    const token = useSelector(state => state.token)
    const { balance: tokenBalance } = token

    return (
        <Table size="sm" className='small'>
            <thead>
                <tr>
                    <th>Token</th>
                    <th>Wallet</th>
                    <th>Exchange</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>ETH</td>
                    <td>{etherBalance}</td>
                    <td>{exchangeEtherBalance}</td>
                </tr>
                <tr>
                    <td>DAPP</td>
                    <td>{tokenBalance}</td>
                    <td>{exchangeTokenBalance}</td>
                </tr>
            </tbody>
        </Table>
    );
}

export default BalanceTable;