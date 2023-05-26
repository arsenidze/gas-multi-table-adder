import { useEffect, useState } from "react";
import { Stack } from 'react-bootstrap';
import { TemplatesView } from "./components/TemplatesView";
import { GASClient } from 'gas-client';
const { serverFunctions } = new GASClient();

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

export const App = () => {
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async () => {
    // const templates = await fetch('http://localhost:3000/data').then((res) => res.json());

    const { data: templates, error } = await serverFunctions.getTemplatesFromProperties();

    if (error) {
      console.error(error);
      return;
    }

    setTemplates(templates);
  };

  const updateTemplates = async (templates) => {
    console.log(templates);
    
    // fetch('http://localhost:3000/data', {
    //   method: 'POST',
    //   body: JSON.stringify(templates)
    // });

    const { error } = await serverFunctions.setTemplatesToScriptProperties(templates);
    if (error) {
      console.error(error);
      return;
    }
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  const setTemplatesExtended = (templates) => {
    setTemplates(templates);
    updateTemplates(templates);
  }

  return (
    <Stack gap={5} className="mx-auto p-3" >
      <TemplatesView
        templates={templates}
        setTemplates={setTemplatesExtended}
      />
    </Stack>
  );
}
