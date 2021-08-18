import { Form, Button } from 'react-bootstrap';

const TransferForm = ({ submitHandler, valueHandler, tokenType, transferType }) => {
    return (
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Control
                    type='text'
                    placeholder={`${tokenType} Amount`}
                    onChange={(e) => valueHandler(e.target.value)}
                    required
                />
            </Form.Group>

            <Button type='submit' className='btn-sm'>{transferType}</Button>
        </Form>
    );
}

export default TransferForm;