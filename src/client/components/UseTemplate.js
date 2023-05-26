import { useState } from "react"
import { Button, Form } from "react-bootstrap";
import { GASClient } from 'gas-client';
const { serverFunctions } = new GASClient();

export const UseTemplate = ({template}) => {
  if (!template) {
    return null;
  }
  const [fieldValues, setFieldValues] = useState(new Array(template.fieldNames.length).fill(''));
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);

  const handleValuesInsert = async () => {
    const { error: responseError } = await serverFunctions.useTemplate(template, fieldValues);
    if (responseError) {
      setError(responseError);
      return;
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    if (form.checkValidity()) {
      // Form is valid, handle submission logic
      console.log('Form is valid');
      // ... additional logic
      handleValuesInsert();
    } else {
      // Form is invalid, display validation errors
      console.log('Form is invalid');
      setValidated(true)
      // form.classList.add('was-validated');
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
          />
          <Form.Control.Feedback type="invalid">
            Значення обов'язкове
          </Form.Control.Feedback>
        </Form.Group>
      ))}

      {error && <p>{error}</p>}

      <Button variant="success" type="submit" className="mt-3 ms-auto">
        Додати
      </Button>
    </Form>
  )
} 
