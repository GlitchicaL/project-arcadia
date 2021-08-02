import { Container, Row, Col } from 'react-bootstrap';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';

// Import Screens
import ExchangeScreen from './screens/ExchangeScreen';

function App() {
	return (
		<Container fluid>
			<Row>
				<Col>
					<Header />
				</Col>
			</Row>

			<ExchangeScreen />

			<Footer />
		</Container>
	);
}

export default App;
