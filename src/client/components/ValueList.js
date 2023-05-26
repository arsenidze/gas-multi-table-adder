import { useState } from 'react';
import { Button, Form, ListGroup, Stack } from 'react-bootstrap';

export const ValueList = ({
  title,
  listValues,
  setListValues,
  afterAdd = () => ({}),
  afterRemove = () => ({}),
  placeholder,
  config
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleAddValue = async () => {
    if (inputValue.trim() === '') {
      setError(config.ERROR_MSGS.VALUE_IS_EMPTY);
      return;
    }

    if (listValues.includes(inputValue)) {
      setError(config.ERROR_MSGS.VALUE_ALREADY_EXISTS);
      return;
    }

    const addedItemIdx = listValues.length;
    setListValues([...listValues, inputValue]);
    afterAdd(inputValue, addedItemIdx);
    setInputValue('');
    setError('');
  };

  const handleRemoveValue = (value) => {
    const removedItemIdx = listValues.findIndex((item) => item === value);
    setListValues(listValues.filter((item) => item !== value));
    afterRemove(value, removedItemIdx)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <Stack gap={1}>
      <h2>{title}</h2>
      <ListGroup as="ol" numbered variant="flush">
        {listValues.map((item, index) => (
          <ListGroup.Item as="li" key={index} className="d-flex align-items-center">
            {item}
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemoveValue(item)}
              className="ms-auto"
            >
              {config.ACTION_MSGS.REMOVE_VALUE}
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNewItem">
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            isInvalid={ !!error }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAddValue();
              }
            }}
          />
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" onClick={handleAddValue} className="mt-3">
          {config.ACTION_MSGS.ADD_VALUE}
        </Button>
      </Form>
    </Stack>
  );
};
