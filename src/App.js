import { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';

// Import Screens
import ExchangeScreen from './screens/ExchangeScreen';

// Import Actions
import { loadWeb3, loadAccount } from './redux/actions/web3Actions';
import { loadToken } from './redux/actions/tokenActions';
import { loadExchange } from './redux/actions/exchangeActions';

function App() {
	const [message, setMessage] = useState(null)

	const dispatch = useDispatch()

	const token = useSelector(state => state.token)
	const { loaded: tokenLoaded } = token

	const exchange = useSelector(state => state.exchange)
	const { loaded: exchangeLoaded } = exchange

	useEffect(() => {
		const loadBlockchainData = async () => {

			try {

				setMessage('Awaiting MetaMask Login...')
				await window.ethereum.enable();

			}
			catch (error) {
				setMessage('MetaMask not detected')
			}

			const web3 = dispatch(loadWeb3())
			dispatch(loadAccount(web3))

			const networkId = await web3.eth.net.getId()

			const token = await dispatch(loadToken(web3, networkId))

			if (!token) {
				setMessage('Token not deployed to the current network. Please select another network with Metamask.')
				return
			}

			const exchange = await dispatch(loadExchange(web3, networkId))

			if (!exchange) {
				setMessage('Exchange not deployed to the current network. Please select another network with Metamask')
				return
			}
		}

		loadBlockchainData()
	}, [dispatch])

	return (
		<Container fluid>
			<Header />

			{(tokenLoaded && exchangeLoaded) ? (
				<ExchangeScreen />
			) : (
				<Container>
					<Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
					{message && <p className='mx-auto text-center my-3'>{message}</p>}
				</Container>
			)}

			<Footer />
		</Container>
	);
}

export default App;
