import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux'

const Header = () => {
    const web3 = useSelector(state => state.web3)
    const { account } = web3

    return (
        <Navbar expand="lg" variant='dark'>
            <Navbar.Brand href="#home">Project Arcadia</Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">

                    <Nav.Link href="#link">Portal</Nav.Link>

                    <NavDropdown title="Explore" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Learn</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Support</NavDropdown.Item>

                        <NavDropdown.Divider />

                        <NavDropdown.Item href="#action/3.4">Source Code</NavDropdown.Item>
                    </NavDropdown>

                    <Nav.Link href={`https://etherscan.io/address/${account}`} target='_blank' style={{ fontFamily: 'Dosis' }}>{account}</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;