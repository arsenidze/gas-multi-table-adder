import { useState } from 'react';
import { Button, Form, ListGroup, Spinner, Stack } from 'react-bootstrap';
import { getSpreadsheetInfoUsingApi } from '../api';

export const SpreadsheetsList = ({
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
  const [isLoading, setIsLoading] = useState(false);

  const handleAddValue = async () => {
    if (inputValue.trim() === '') {
      setError(config.ERROR_MSGS.VALUE_IS_EMPTY);
      return;
    }

    if (listValues.find((ss) => ss.url === inputValue)) {
      setError(config.ERROR_MSGS.VALUE_ALREADY_EXISTS);
      return;
    }

    setIsLoading(true);
    const ssInfo = await getSpreadsheetInfoUsingApi(inputValue);
    setIsLoading(false);
    if (ssInfo.error) {
      setError(ssInfo.error);
      return;
    }

    const newSs = {
      url: inputValue,
      name: ssInfo.data.spreadsheetName,
      sheetName: ssInfo.data.sheetName,
      spreadsheetId: ssInfo.data.spreadsheetId,
      sheetId: ssInfo.data.sheetId,
      allowedColumnCharIndexes: ssInfo.data.allowedColumnCharIndexes,
    }

    const addedItemIdx = listValues.length;
    setListValues([...listValues, newSs]);
    afterAdd(newSs, addedItemIdx);
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
            <a href={item.url} target="_blank" referrerPolicy="no-referrer">
              <span>{item.name} | {item.sheetName}</span>
            </a>
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
            disabled={isLoading}
          />
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="primary"
          onClick={handleAddValue}
          className="mt-3"
          disabled={isLoading}
        >
          {isLoading && <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-1"
          />}
          {config.ACTION_MSGS.ADD_VALUE}
        </Button>
      </Form>
    </Stack>
  );
};
