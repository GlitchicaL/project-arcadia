import { Form, Button } from 'react-bootstrap';

const OrderForm = ({ submitHandler, setAmount, setPrice, orderType }) => {
    return (
        <Form onSubmit={submitHandler} className='my-4'>

            <Form.Group>
                <Form.Control
                    type='text'
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />

                <Form.Label><span className='content-name'>{orderType} Amount (DAPP)</span></Form.Label>
            </Form.Group>

            <Form.Group>
                <Form.Control
                    type='text'
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <Form.Label><span className='content-name'>{orderType} Price (DAPP)</span></Form.Label>
            </Form.Group>

            <Button type='submit' className='my-3 btn-sm'><span>{orderType}</span></Button>

        </Form>
    );
}

export default OrderForm;