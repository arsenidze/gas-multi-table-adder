import { useState } from "react";
import { Button, ButtonGroup, Container, Form, ListGroup, Modal, Tooltip } from "react-bootstrap"
import { ConfigureTemplate } from "./ConfigureTemplate";
import { UseTemplate } from "./UseTemplate";

const EMPTY_TEMPLATE = {
  name: '',
  spreadSheetNames: [],
  spreadSheets: [],
  fieldNames: [],
  mapping: [],
}

export const TemplatesView = ({
  templates,
  setTemplates,
  afterAdd = () => ({}),
  afterRemove = () => ({}),
  afterUpdate = () => ({}),
}) => {
  const [newTemplate, setNewTemplate] = useState(EMPTY_TEMPLATE);
  const [newTemplateError, setNewTemplateError] = useState('');

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(-1);
  const [showUseModal, setShowUseModal] = useState(false);
  const [showConfigureModal, setShowConfigureModal] = useState(false);

  const addNewTemplate = async () => {
    if (newTemplate.name.trim() === '') {
      setNewTemplateError('Значення порожнє');
      return;
    }

    if (templates.find((template) => template.name === newTemplate.name)) {
      setNewTemplateError('Шаблон з такою назвою вже інсує');
      return;
    }

    const addedItemIdx = templates.length;
    setTemplates([...templates, newTemplate]);
    afterAdd(newTemplate, addedItemIdx);
    setNewTemplate(EMPTY_TEMPLATE);
    setNewTemplateError('');
  }

  const openUseModal = (template, index) => {
    setSelectedTemplateIdx(index);
    setSelectedTemplate(template);
    setShowUseModal(true);
  }

  const handleCloseOfUseModal = () => {
    setShowUseModal(false);
    setSelectedTemplate(null);
    setSelectedTemplateIdx(-1);
  }

  const openConfigureModal = (template, index) => {
    setSelectedTemplateIdx(index);
    setSelectedTemplate(template);
    setShowConfigureModal(true);
  }

  const handleCloseOfConfigureModal = () => {
    setShowConfigureModal(false);
    setSelectedTemplate(null);
    setSelectedTemplateIdx(-1);
  }

  const handleSaveChangesOfConfigureModal = () => {
    const templatesCopy = [...templates];
    templatesCopy[selectedTemplateIdx] = {...selectedTemplate};
    setTemplates(templatesCopy);
    afterUpdate(selectedTemplate, selectedTemplateIdx);

    setShowConfigureModal(false);
    setSelectedTemplate(null);
    setSelectedTemplateIdx(-1);
  }

  const deleteTemplate = (template, index) => {
    setTemplates(templates.filter((_, idx) => idx !== index));
    afterRemove(template, index);
  }

  const isTemplateCanBeUsed = (template) => {
    return template.fieldNames.length !== 0 &&
      template.spreadSheets.length !== 0 &&
      template.mapping.every((m) => m.some((v) => !!v))
  }

  return (
    <Container>
      {templates.length !== 0 && <h2>Існуючі шаблони:</h2>}

      <ListGroup as="ol" numbered variant="flush">
        {templates.map((template, index) => (
          <ListGroup.Item as="li" key={index} className="d-flex justify-content-start align-items-center">
            <span>{template.name}</span>
            <ButtonGroup className="ms-auto">
              {isTemplateCanBeUsed(template) && <Button variant="primary" onClick={() => openUseModal(template, index)}>Використати</Button>}
              {/* <Tooltip placement="top" className="in" id="tooltip-right">
                <Button variant="info" onClick={() => openConfigureModal(template, index)}>Налаштувати</Button>
              </Tooltip> */}
              <Button variant="info" onClick={() => openConfigureModal(template, index)}>Налаштувати</Button>
              <Button variant="danger" onClick={() => deleteTemplate(template, index)}>Видалити</Button>
            </ButtonGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Ім'я шаблону"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
            isInvalid={ !!newTemplateError }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                addNewTemplate();
              }
            }}
          />
          <Form.Control.Feedback type='invalid'>
            { newTemplateError }
        </Form.Control.Feedback>
        </Form.Group>

        <Button variant="success" onClick={addNewTemplate}>
          Додати новий
        </Button>
      </Form>

      <Modal show={showUseModal} onHide={handleCloseOfUseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Додати нові дані</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UseTemplate template={selectedTemplate}/>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOfUseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseOfUseModal}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>

      <Modal show={showConfigureModal} onHide={handleCloseOfConfigureModal}>
        <Modal.Header closeButton>
          <Modal.Title>Налаштувати шаблон</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ConfigureTemplate
            template={selectedTemplate}
            setTemplate={setSelectedTemplate}
            handleSaveChanges={handleSaveChangesOfConfigureModal}
          />
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOfConfigureModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChangesOfConfigureModal}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </Container>
  )
}
