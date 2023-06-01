import { useState } from "react"
import { Alert, Button, Form, ListGroup, Spinner } from "react-bootstrap";
import { useTemplateUsingApi } from "../api";

export const UseTemplate = ({template}) => {
  if (!template) {
    return null;
  }
  const [fieldValues, setFieldValues] = useState(new Array(template.fieldNames.length).fill(''));
  const [message, setMessage] = useState('');
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rowLinks, setRowLinks] = useState([]);

  const handleValuesInsert = async () => {
    setIsLoading(true);
    const { data: insertedRowLinks, error: responseError } = await useTemplateUsingApi(template, fieldValues);
    setIsLoading(false);
    if (responseError) {
      setMessage(`Помилка: ${responseError}`);
      return;
    }
    setRowLinks(insertedRowLinks);
    setMessage(`Дані були додані до ${template.spreadSheets.length} таблиць`);

    // setTimeout(() => {
    //   setMessage('');
    //   setRowLinks([]);
    // }, 20000);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    setMessage('');

    if (form.checkValidity()) {
      console.log('Form is valid');
      await handleValuesInsert();
      setValidated(false);
      setFieldValues(new Array(template.fieldNames.length).fill(''));
    } else {
      console.log('Form is invalid');
      setValidated(true)
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      {template.fieldNames.map((fieldName, fieldIndex) => (
        <Form.Group controlId={`formControl${fieldIndex}`} key={fieldIndex}>
          <Form.Label>{fieldName}</Form.Label>
          <Form.Control
            required
            type="text"
            value={fieldValues[fieldIndex]}
            onChange={(e) => {
              const fieldValuesCopy = [...fieldValues];
              fieldValuesCopy[fieldIndex] = e.target.value;
              setFieldValues(fieldValuesCopy);
            }}
            disabled={isLoading}
          />
          <Form.Control.Feedback type="invalid">
            Значення обов'язкове
          </Form.Control.Feedback>
        </Form.Group>
      ))}
      {message && 
        <Alert 
          variant={message.includes('Помилка') ? 'danger' : 'success'}
          className="mt-3"
          onClose={() => setMessage('')}
          dismissible
        >
          {message}
          <br />
          <br />
          {rowLinks.length !== 0 && (
            <>
              <span>Посилання на нові рядки:</span>
              <ListGroup as="ol" numbered variant="flush">
                {rowLinks.map((rowLink, index) => (
                  <ListGroup.Item as="li" key={index} className="d-flex align-items-center" variant="success">
                    <span>
                      {'Новий '}
                      <a href={rowLink} target="_blank" rel="noreferrer">
                        <span>рядок</span>
                      </a>
                      {` в таблиці: ${template.spreadSheets[index].name} | ${template.spreadSheets[index].sheetName}`}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Alert>
      }
      <Button
        variant="success"
        type="submit"
        className="mt-3 ms-auto"
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
        Додати
      </Button>
    </Form>
  )
} 
