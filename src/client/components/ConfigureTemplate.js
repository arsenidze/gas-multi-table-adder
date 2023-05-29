import { Button, Stack } from 'react-bootstrap';
import { MappingTable } from './MappingTable';
import { ValueList } from "./ValueList";
import { SpreadsheetsList } from './SpreadsheetsList';

const config = {
  ERROR_MSGS: {
    VALUE_IS_EMPTY: 'Значення порожнє',
    VALUE_ALREADY_EXISTS: 'Таке значення вже існує',
  },
  ACTION_MSGS: {
    REMOVE_VALUE: 'Видалити',
    ADD_VALUE: 'Додати',
  }
}

const EMPTY_MAPPING = '';

export const ConfigureTemplate = ({
  template, setTemplate,
  handleSaveChanges,
}) => {
  if (!template) {
    return null;
  }

  const updateTemplateWithValues = (values) => {
    setTemplate((prevState) => ({...prevState, ...values}));
  }

  const addNewSpreadsheetToMapping = () => {
    setTemplate((prevState) => ({ ...prevState, mapping: [...prevState.mapping, new Array(prevState.fieldNames.length).fill(EMPTY_MAPPING)] }));
  }

  const removeSpreadsheetFromMapping = (spreadsheetIdx) => {
    setTemplate((prevState) => ({...prevState, mapping: prevState.mapping.filter((row, idx) => idx !== spreadsheetIdx)}));
  }

  const addFieldToMapping = () => {
    setTemplate((prevState) => ({...prevState, mapping: prevState.mapping.map((row) => [...row, EMPTY_MAPPING])}));
  }

  const removeFieldFromMapping = (fieldIdx) => {
    setTemplate((prevState) => ({...prevState, mapping: prevState.mapping.map((row) => row.filter((_, idx) => idx !== fieldIdx))}));
  }

  return (
    <Stack gap={3} className="mx-auto p-3"  >
      <div className="template-name">
        <h2>Назва шаблону</h2>
        <span>{template.name}</span>
      </div>
      <SpreadsheetsList
        title="В які таблиці додавати?"
        placeholder="https://docs.google.com/spreadsheets/d/.../edit#gid=..."
        listValues={template.spreadSheets}
        setListValues={(newListValues) => updateTemplateWithValues({ spreadSheets: newListValues })}
        afterAdd={
          (value, addedItemIdx) => addNewSpreadsheetToMapping()
        }
        afterRemove={
          (value, removedItemIdx) => removeSpreadsheetFromMapping(removedItemIdx)
        }
        config={config}
      />
      <ValueList
        title="Які поля існують?"
        placeholder="Поле1"
        listValues={template.fieldNames}
        setListValues={(newListValues) => updateTemplateWithValues({ fieldNames: newListValues })}
        afterAdd={
          (value, addedItemIdx) => addFieldToMapping()
        }
        afterRemove={
          (value, removedItemIdx) => removeFieldFromMapping(removedItemIdx)
        }
        config={config}
      />
      { template.fieldNames.length !== 0 && template.spreadSheets.length !== 0 &&
        <MappingTable
          title="Відповідність між колонками з таблиць та полями"
          rows={template.fieldNames}
          columns={template.spreadSheets.map((s) => s.name)}
          // allowedValuesPerCol={[['A', 'B', 'C'], ['A', 'B', 'C'], ['A', 'B', 'C'], ['A', 'B', 'C'], ['A', 'B', 'C']]}
          allowedValuesPerCol={template.spreadSheets.map((s) => s.allowedColumnCharIndexes)}
          cells={template.mapping}
          setCells={(newCells) => updateTemplateWithValues({mapping: newCells})}
        />
      }
      <Button variant="success" onClick={handleSaveChanges} className="mt-3 ms-auto">
        Зберегти
      </Button>
    </Stack>
  );
}
