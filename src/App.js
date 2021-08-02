import { Container } from 'react-bootstrap';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';

// Import Screens
import ExchangeScreen from './screens/ExchangeScreen';

function App() {
	return (
		<Container fluid>
			<Header />

			<ExchangeScreen />

			<Footer />
		</Container>
	);
}

export default App;
