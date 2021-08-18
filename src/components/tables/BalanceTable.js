import { Table } from 'react-bootstrap';

const BalanceTable = ({ etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance }) => {
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