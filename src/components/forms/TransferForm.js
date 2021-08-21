import { Form, Button } from 'react-bootstrap';

const TransferForm = ({ submitHandler, valueHandler, tokenType, transferType }) => {
    return (
        <Form onSubmit={submitHandler} className='my-2 flex flex--left'>
            <Form.Group>
                <Form.Control
                    type='text'
                    onChange={(e) => valueHandler(e.target.value)}
                    required
                />
                <Form.Label><span className='content-name'>{`${tokenType} Amount`}</span></Form.Label>
            </Form.Group>

            <Button type='submit' className='btn-sm mx-4'><span>{transferType}</span></Button>
        </Form>
    );
}

export default TransferForm;