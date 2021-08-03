import { useEffect } from 'react';
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
	const dispatch = useDispatch()

	const token = useSelector(state => state.token)
	const { loaded: tokenLoaded } = token

	const exchange = useSelector(state => state.exchange)
	const { loaded: exchangeLoaded } = exchange

	useEffect(() => {
		const loadBlockchainData = async () => {
			const web3 = dispatch(loadWeb3())

			await window.ethereum.enable();

			dispatch(loadAccount(web3))

			const networkId = await web3.eth.net.getId()

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
		<Container fluid>
			<Header />

			{(tokenLoaded && exchangeLoaded) ? (
				<ExchangeScreen />
			) : (
				<Container>
					<Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
				</Container>
			)}

			<Footer />
		</Container>
	);
}

export default App;
